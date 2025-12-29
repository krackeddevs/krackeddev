-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- new, reviewing, shortlisted, rejected, hired
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS job_applications_job_id_idx ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON public.job_applications(status);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Candidates can create applications (Insert)
CREATE POLICY "Candidates can create applications"
ON public.job_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Candidates can view their own applications (Select)
CREATE POLICY "Candidates can view own applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Company Members can view applications for their jobs (Select)
-- This requires a join to jobs -> companies -> company_members
-- For performance/complexity, we can might need a helper function or direct policy using exists
CREATE POLICY "Company members can view applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.jobs j
        JOIN public.company_members cm ON j.company_id = cm.company_id
        WHERE j.id = job_applications.job_id
        AND cm.user_id = auth.uid()
    )
);

-- 4. Company Members can update status (Update)
CREATE POLICY "Company members can update status"
ON public.job_applications FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.jobs j
        JOIN public.company_members cm ON j.company_id = cm.company_id
        WHERE j.id = job_applications.job_id
        AND cm.user_id = auth.uid()
    )
);
