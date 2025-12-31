-- Create messages table
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    channel_id text not null default 'general',
    user_id uuid references public.profiles(id) not null,
    content text not null,
    created_at timestamptz default now() not null,
    is_deleted boolean default false not null
);

-- RLS Policies
alter table public.messages enable row level security;

create policy "Messages are viewable by everyone"
    on public.messages for select
    using (true);

create policy "Authenticated users can insert messages"
    on public.messages for insert
    with check (auth.uid() = user_id);

-- Indexes
create index messages_channel_id_created_at_idx on public.messages (channel_id, created_at desc);

-- Realtime
alter publication supabase_realtime add table public.messages;
