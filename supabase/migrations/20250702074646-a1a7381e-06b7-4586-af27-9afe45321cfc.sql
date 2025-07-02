-- Check if user_notification_settings and user_privacy_settings tables need to be created

-- Create user_notification_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_reminders BOOLEAN NOT NULL DEFAULT true,
  friend_requests BOOLEAN NOT NULL DEFAULT true,
  event_invitations BOOLEAN NOT NULL DEFAULT true,
  new_messages BOOLEAN NOT NULL DEFAULT true,
  event_updates BOOLEAN NOT NULL DEFAULT true,
  marketing_emails BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_privacy_settings table if it doesn't exist  
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_profile BOOLEAN NOT NULL DEFAULT true,
  show_event_attendance BOOLEAN NOT NULL DEFAULT true,
  share_activity_with_friends BOOLEAN NOT NULL DEFAULT true,
  allow_tagging BOOLEAN NOT NULL DEFAULT true,
  show_rsvp_status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_notification_settings
DROP POLICY IF EXISTS "Users can view own notification settings" ON public.user_notification_settings;
DROP POLICY IF EXISTS "Users can update own notification settings" ON public.user_notification_settings;
DROP POLICY IF EXISTS "Users can insert own notification settings" ON public.user_notification_settings;

CREATE POLICY "Users can view own notification settings"
ON public.user_notification_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
ON public.user_notification_settings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
ON public.user_notification_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_privacy_settings
DROP POLICY IF EXISTS "Users can view own privacy settings" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "Users can update own privacy settings" ON public.user_privacy_settings;
DROP POLICY IF EXISTS "Users can insert own privacy settings" ON public.user_privacy_settings;

CREATE POLICY "Users can view own privacy settings"
ON public.user_privacy_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own privacy settings"
ON public.user_privacy_settings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own privacy settings"
ON public.user_privacy_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update profiles table to not pre-fill tagline or other fields
ALTER TABLE public.profiles 
ALTER COLUMN tagline SET DEFAULT NULL;