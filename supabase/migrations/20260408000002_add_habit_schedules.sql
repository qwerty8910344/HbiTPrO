-- Add schedule and reminder columns to habits table
alter table public.habits add column if not exists schedule_type text not null default 'daily';
alter table public.habits add column if not exists schedule_days text[] not null default '{}';
alter table public.habits add column if not exists reminder_type text not null default 'none';
alter table public.habits add column if not exists reminder_value text not null default '';
