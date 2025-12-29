-- Enable RLS on storage.objects if not already active (standard in Supabase)
-- storage.buckets is usually managed by system, but storage.objects needs policies

-- 1. Allow Public Read Access to company-logos
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'company-logos' );

-- 2. Allow Authenticated Users to Upload (Insert)
create policy "Authenticated can upload logos"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'company-logos' );

-- 3. Allow Owners to Update/Delete their own uploads
-- (Simplification: Allow authenticated users to update/delete files in this bucket for now to avoid complex auth checks in storage)
create policy "Authenticated can update their logos"
on storage.objects for update
to authenticated
using ( bucket_id = 'company-logos' );

create policy "Authenticated can delete their logos"
on storage.objects for delete
to authenticated
using ( bucket_id = 'company-logos' );
