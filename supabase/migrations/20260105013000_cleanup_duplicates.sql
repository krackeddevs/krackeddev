-- 1. Fix the Inquiry Status
-- This ensures the "Approve & Publish" button disappears for the testing inquiry
UPDATE public.bounty_inquiries
SET status = 'approved'
WHERE title = 'Testing Company Bounty Posting' AND status = 'new';

-- 2. Remove Duplicate Bounties
-- This keeps only the MOST RECENT bounty for this title and deletes the older duplicates
DELETE FROM public.bounties
WHERE id IN (
  SELECT id FROM (
    SELECT id,
    ROW_NUMBER() OVER (PARTITION BY title, company_name ORDER BY created_at DESC) as r_num
    FROM public.bounties
    WHERE title = 'Testing Company Bounty Posting'
  ) t
  WHERE t.r_num > 1
);
