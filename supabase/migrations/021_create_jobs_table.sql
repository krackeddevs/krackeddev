-- ============================================
-- CREATE JOBS TABLE
-- Tech job board data scraped from external sources
-- ============================================

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  is_remote BOOLEAN DEFAULT false,
  employment_type TEXT,
  source_url TEXT,
  source_site TEXT,
  posted_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  salary_min INTEGER,
  salary_max INTEGER
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS jobs_company_idx ON public.jobs(company);
CREATE INDEX IF NOT EXISTS jobs_location_idx ON public.jobs(location);
CREATE INDEX IF NOT EXISTS jobs_is_active_idx ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS jobs_posted_at_idx ON public.jobs(posted_at);
CREATE INDEX IF NOT EXISTS jobs_source_site_idx ON public.jobs(source_site);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active jobs
CREATE POLICY "Public can view active jobs"
  ON public.jobs
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all jobs (including inactive)
CREATE POLICY "Authenticated users can view all jobs"
  ON public.jobs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only admins can insert/update/delete jobs
CREATE POLICY "Admins can manage jobs"
  ON public.jobs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comments
COMMENT ON TABLE public.jobs IS 'Tech job postings scraped from external sources';
COMMENT ON COLUMN public.jobs.id IS 'Unique job identifier from source (e.g., URL hash or external ID)';
COMMENT ON COLUMN public.jobs.is_active IS 'Whether the job is still accepting applications';
COMMENT ON COLUMN public.jobs.source_site IS 'Source website (e.g., linkedin, remoteok, indeed)';
