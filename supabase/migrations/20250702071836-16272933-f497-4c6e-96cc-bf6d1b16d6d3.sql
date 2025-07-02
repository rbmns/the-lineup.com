-- Fix RLS policies for events storage bucket to allow authenticated users to upload images

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access for event images" ON storage.objects;

-- Create policies for the events bucket
-- Policy for public read access to event images
CREATE POLICY "Allow public read access for event images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'events');

-- Policy for authenticated users to upload event images
CREATE POLICY "Allow authenticated users to upload event images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'events');

-- Policy for authenticated users to update event images
CREATE POLICY "Allow authenticated users to update event images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'events');

-- Policy for authenticated users to delete event images
CREATE POLICY "Allow authenticated users to delete event images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'events');

-- Add pending status to the event_status enum
ALTER TYPE event_status ADD VALUE IF NOT EXISTS 'pending';

-- Add a creator_email field to events table to handle pending events
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS creator_email TEXT;

-- Update the events RLS policy to allow creating events with pending status
DROP POLICY IF EXISTS "Allow authenticated users to create events" ON public.events;

CREATE POLICY "Allow authenticated users to create events"
ON public.events
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to create events (they set themselves as creator)
  (auth.uid() IS NOT NULL AND auth.uid() = creator) OR
  -- Allow unauthenticated users to create events with pending status
  (auth.uid() IS NULL AND creator IS NULL AND status = 'pending')
);