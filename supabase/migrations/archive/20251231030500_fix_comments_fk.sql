-- Change FK from auth.users to public.profiles to allow PostgREST joins
alter table comments
  drop constraint if exists comments_author_id_fkey;

alter table comments
  add constraint comments_author_id_fkey
  foreign key (author_id)
  references public.profiles(id)
  on delete cascade;
