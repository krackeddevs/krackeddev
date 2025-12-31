-- Create a public bucket for community images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do nothing;

-- Policy: Public can view images
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'community-images' );

-- Policy: Authenticated users can upload images
drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'community-images' AND auth.role() = 'authenticated' );

-- Policy: Authenticated users can update/delete their own images
drop policy if exists "Users can update own images" on storage.objects;
create policy "Users can update own images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'community-images' AND owner = auth.uid() );

drop policy if exists "Users can delete own images" on storage.objects;
create policy "Users can delete own images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'community-images' AND owner = auth.uid() );
