-- Drop the restrictive policy
drop policy if exists "Users can view groups they are members of" on public.groups;

-- Create a more robust viewing policy: Users can see a group if they created it OR are a member.
create policy "Users can view groups they created or are members of" on public.groups 
  for select using (
    auth.uid() = created_by 
    or exists (
      select 1 from public.group_members gm 
      where gm.group_id = id and gm.user_id = auth.uid()
    )
  );

-- Ensure group_members can be inserted by the creator during creation flow
-- (The existing policy "Users can insert their own membership" covers this)
-- But we add a group-specific insert for safety
drop policy if exists "Users can insert their own membership" on public.group_members;
create policy "Users can manage their own memberships" on public.group_members
  for all using (auth.uid() = user_id);
