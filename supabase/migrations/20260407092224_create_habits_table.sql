-- Create the habits table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  icon text not null default '💧',
  color text not null default 'var(--habit-blue)',
  current integer not null default 0,
  total integer not null default 1,
  unit text not null default 'times',
  streak integer not null default 0,
  completed boolean not null default false,
  category text not null default 'Health',
  memo text,
  mood text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.habits enable row level security;

-- Create Policies
create policy "Users can view their own habits" on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert their own habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits" on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete their own habits" on public.habits for delete using (auth.uid() = user_id);
