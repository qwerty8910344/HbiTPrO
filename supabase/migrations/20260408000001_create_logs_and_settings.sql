-- Create user_settings table
create table public.user_settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  dark_mode boolean not null default true,
  adhd_mode boolean not null default false,
  face_id boolean not null default false,
  language text not null default 'English',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create habit_logs table for tracking daily history and heatmap contribution
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_date date not null default current_date,
  created_at timestamptz default now() not null,
  unique(habit_id, completed_date) -- A habit can only be logged once per day
);

-- Enable RLS
alter table public.user_settings enable row level security;
alter table public.habit_logs enable row level security;

-- user_settings policies
create policy "Users can view their own settings" on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can insert their own settings" on public.user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update their own settings" on public.user_settings for update using (auth.uid() = user_id);

-- habit_logs policies
create policy "Users can view their own logs" on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert their own logs" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can delete their own logs" on public.habit_logs for delete using (auth.uid() = user_id);
