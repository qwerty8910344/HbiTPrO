-- Add subscription columns to user_settings
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trialing',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ DEFAULT NOW();

-- Add a comment to describe tiers
COMMENT ON COLUMN public.user_settings.subscription_tier IS 'free, monthly, yearly';
COMMENT ON COLUMN public.user_settings.subscription_status IS 'trialing, active, past_due, canceled';
