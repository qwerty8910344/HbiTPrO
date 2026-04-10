-- Add avatar_url to user_settings
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Storage Bucket Setup (This assumes the extensions for storage are enabled)
-- Create bucket if it doesn't exist (May require superuser/dashboard, but here is the policy setup)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for avatars bucket
-- Allow public read access to all avatars
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Individual User Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Individual User Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
