-- Add DOB column to user_settings
alter table public.user_settings add column if not exists dob date;

-- Ensure RLS allows the user to set their own DOB
-- (The existing "Users can update their own settings" policy already covers this)
