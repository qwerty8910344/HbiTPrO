-- Create tables
create table public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text not null default '🌟',
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

create table public.group_members (
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamptz default now() not null,
  primary key (group_id, user_id)
);

create table public.shared_habits (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  shared_at timestamptz default now() not null,
  unique(group_id, habit_id) -- A habit can only be shared once per group
);

-- Row Level Security (RLS) policies
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.shared_habits enable row level security;

-- groups policies
-- Users can see a group if they are a member of it.
create policy "Users can view groups they are members of" on public.groups 
  for select using (
    exists (
      select 1 from public.group_members gm 
      where gm.group_id = id and gm.user_id = auth.uid()
    )
  );
  
-- Users can create groups
create policy "Users can insert groups" on public.groups 
  for insert with check (auth.uid() = created_by);

-- group_members policies
-- Users can see members of groups they are part of
create policy "Users can view members of their groups" on public.group_members
  for select using (
    exists (
      select 1 from public.group_members my_gm 
      where my_gm.group_id = group_id and my_gm.user_id = auth.uid()
    )
  );

-- Users can join a group (insert themselves into group_members)
create policy "Users can insert their own membership" on public.group_members
  for insert with check (auth.uid() = user_id);

-- shared_habits policies
-- Users can see shared habits for groups they are part of
create policy "Users can view shared habits in their groups" on public.shared_habits
  for select using (
    exists (
      select 1 from public.group_members my_gm 
      where my_gm.group_id = group_id and my_gm.user_id = auth.uid()
    )
  );

-- Users can share their *own* habits into groups they are members of
create policy "Users can share their own habits into their groups" on public.shared_habits
  for insert with check (
    auth.uid() = user_id 
    and exists (
      select 1 from public.group_members gm 
      where gm.group_id = group_id and gm.user_id = auth.uid()
    )
    and exists (
      select 1 from public.habits h 
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );
