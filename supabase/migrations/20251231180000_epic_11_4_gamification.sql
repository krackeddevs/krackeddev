-- EPIC 11.4: Gamification & Accepted Answers
-- 1. UPDATE XP EVENT TYPES
-- We need to drop the old check constraint and add a new one to include community events
ALTER TABLE public.xp_events
DROP CONSTRAINT IF EXISTS xp_events_event_type_check;

ALTER TABLE public.xp_events
ADD CONSTRAINT xp_events_event_type_check 
CHECK (event_type IN (
  'daily_login',
  'github_contribution',
  'bounty_submission',
  'bounty_win',
  'streak_milestone',
  'profile_completion',
  'manual_adjustment',
  -- New Community Events
  'ask_question',
  'answer_question',
  'answer_accepted',
  'upvote_received'
));

-- 2. UNIQUE ACCEPTED ANSWER
-- Ensure only one answer per question can be marked accepted
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_accepted_answer_per_question 
ON public.answers(question_id) 
WHERE is_accepted = true;


-- 3. AWARD XP FUNCTION (Secure RPC)
-- This function allows the system (via RLS or trusted backend) to award XP
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_event_type TEXT,
  p_amount INT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID AS $$
BEGIN
  -- Insert event (Trigger will auto-update profile XP/Level)
  INSERT INTO public.xp_events (user_id, event_type, xp_amount, metadata)
  VALUES (p_user_id, p_event_type, p_amount, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION award_xp(UUID, TEXT, INT, JSONB) TO authenticated, service_role;


-- 4. TOGGLE ACCEPTED ANSWER RPC
-- Atomically handles unaccepting partial/old answers and accepting new one + awarding XP
CREATE OR REPLACE FUNCTION toggle_accepted_answer(
  p_question_id UUID,
  p_answer_id UUID
) RETURNS VOID AS $$
DECLARE
  v_question_author_id UUID;
  v_answer_author_id UUID;
  v_old_accepted_answer_id UUID;
  v_is_already_accepted BOOLEAN;
BEGIN
  -- 1. Verify User is Question Author
  SELECT author_id INTO v_question_author_id FROM public.questions WHERE id = p_question_id;
  
  IF v_question_author_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized. Only question author can accept answers.';
  END IF;

  -- 2. Get Answer details
  SELECT author_id, is_accepted INTO v_answer_author_id, v_is_already_accepted 
  FROM public.answers WHERE id = p_answer_id;

  IF v_answer_author_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot accept your own answer.';
  END IF;

  -- 3. Logic Switch
  IF v_is_already_accepted THEN
    -- UNACCEPT: Just turn it off (No XP refund, generally we keep XP or could deduct, but simpler to keep)
    -- Actually, simpler logic: Clicking accepted again usually does nothing or unaccepts. 
    -- Let's implement UNACCEPT for flexibility.
    UPDATE public.answers SET is_accepted = false WHERE id = p_answer_id;
    UPDATE public.questions SET accepted_answer_id = NULL WHERE id = p_question_id;
    
  ELSE
    -- ACCEPT:
    -- A. Unaccept any existing answer for this question
    UPDATE public.answers SET is_accepted = false WHERE question_id = p_question_id AND is_accepted = true;
    
    -- B. Accept new answer
    UPDATE public.answers SET is_accepted = true, updated_at = NOW() WHERE id = p_answer_id;
    UPDATE public.questions SET accepted_answer_id = p_answer_id WHERE id = p_question_id;

    -- C. Award XP to Answer Author (+100 XP)
    PERFORM award_xp(
      v_answer_author_id, 
      'answer_accepted', 
      100, 
      jsonb_build_object('question_id', p_question_id, 'answer_id', p_answer_id, 'role', 'answerer')
    );

    -- D. Award XP to Question Author (+20 XP for closing the loop)
    PERFORM award_xp(
      v_question_author_id, 
      'answer_accepted', 
      20, 
      jsonb_build_object('question_id', p_question_id, 'answer_id', p_answer_id, 'role', 'asker')
    );
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION toggle_accepted_answer(UUID, UUID) TO authenticated, service_role;
