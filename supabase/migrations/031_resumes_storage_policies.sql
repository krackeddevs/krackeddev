-- Create resumes storage bucket policies
-- This bucket stores applicant resumes (private, not public)

-- Note: You need to manually create the 'resumes' bucket first in Supabase Dashboard:
-- Storage > New Bucket > Name: "resumes" > Make it PRIVATE

-- Allow authenticated users to upload their own resumes
CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own resumes
CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow company owners/admins to read resumes for their job applications
CREATE POLICY "Company members can read applicant resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM job_applications ja
    JOIN jobs j ON ja.job_id = j.id
    JOIN company_members cm ON cm.company_id = j.company_id
    WHERE cm.user_id = auth.uid() 
    AND cm.role IN ('owner', 'admin')
    AND ja.resume_url = name
  )
);
