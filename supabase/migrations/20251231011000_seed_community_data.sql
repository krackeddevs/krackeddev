-- Talk to the hand, or rather, the database.
DO $$
DECLARE
  v_user_id uuid;
  v_question_id_1 uuid;
  v_question_id_2 uuid;
  v_answer_id uuid;
BEGIN
  -- Get first user
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Question 1 (Solved)
    INSERT INTO public.questions (title, slug, body, author_id, tags, upvotes, view_count)
    VALUES 
    ('How to implement Supabase Realtime with Next.js App Router?', 'supabase-realtime-nextjs-app-router', 'I typically use the `pages` directory but I am migrating to App Router. How do I handle the efficient subscription in a Server Component or should I use a Client Component wrapper? any code snippets appreciated.', v_user_id, ARRAY['supabase', 'nextjs', 'realtime'], 42, 1205)
    RETURNING id INTO v_question_id_1;

    INSERT INTO public.answers (question_id, body, author_id, is_accepted, upvotes)
    VALUES 
    (v_question_id_1, 'You definitely need a Client Component for the subscription because it involves WebSocket connections which are browser-side.

Here is a quick hook pattern:

```tsx
"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

export function useRealtime() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase.channel("room1")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        console.log("Change received!", payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}
```

This works perfectly in App Router if you import this hook into a client component.', v_user_id, true, 15)
    RETURNING id INTO v_answer_id;
    
    UPDATE public.questions SET accepted_answer_id = v_answer_id WHERE id = v_question_id_1;

    -- Question 2 (Unsolved)
    INSERT INTO public.questions (title, slug, body, author_id, tags, upvotes, view_count)
    VALUES 
    ('Best practices for Tailwind CSS architecture in large projects?', 'tailwind-css-architecture-large-projects', 'I am finding my class strings getting very long. Do you guys use CVA (Class Variance Authority) or just standard utility classes? Also how do you organize custom theme tokens?', v_user_id, ARRAY['css', 'tailwindcss', 'architecture'], 12, 340)
    RETURNING id INTO v_question_id_2;
    
    INSERT INTO public.answers (question_id, body, author_id, is_accepted, upvotes)
    VALUES 
    (v_question_id_2, 'I personally recommend **CVA** for component libraries. It makes handling variants much cleaner.', v_user_id, false, 3);

  END IF;
END $$;
