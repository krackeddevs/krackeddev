-- Create bounties table
create table if not exists public.bounties (
  id uuid not null default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  reward_amount numeric not null default 0,
  status text not null default 'open', -- open, assigned, completed, cancelled
  type text not null default 'bounty', -- bounty, project, gig
  skills text[] default '{}',
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint bounties_pkey primary key (id)
);

-- Create bounty_inquiries table (for Lead Capture)
create table if not exists public.bounty_inquiries (
  id uuid not null default gen_random_uuid(),
  company_name text not null,
  email text not null,
  budget_range text not null,
  description text not null,
  status text not null default 'new', -- new, contacted, closed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint bounty_inquiries_pkey primary key (id)
);

-- Enable RLS
alter table public.bounties enable row level security;
alter table public.bounty_inquiries enable row level security;

-- Policies for bounties
-- Public can view open bounties
create policy "Public can view open bounties"
  on public.bounties for select
  using (status = 'open');

-- Only admins can insert/update/delete (assuming service role for now or specific admin policy later)
-- For now, we'll leave it as accessible to authenticated users if they are admin, 
-- but since we don't have a rigid admin system in this migration, allow auth users to read all.
create policy "Authenticated users can view all bounties"
  on public.bounties for select
  to authenticated
  using (true);

-- Policies for bounty_inquiries
-- Public can insert (Lead Capture)
create policy "Public can insert inquiries"
  on public.bounty_inquiries for insert
  with check (true);

-- Only admins can view inquiries (Secure)
-- This policy assumes an 'admin' role check or similar. 
-- For safety, we restrict select to service_role mostly, or authenticated users who are admins.
-- Adding a basic rule for now:
create policy "Admins can view inquiries"
  on public.bounty_inquiries for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'service_role' OR (select role from public.profiles where id = auth.uid()) = 'admin');
