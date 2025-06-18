
-- Fix the RLS policies to ensure events are visible on public pages
-- Drop the overly restrictive public policy
DROP POLICY IF EXISTS "Public can view published events" ON public.events;

-- Create a more permissive public policy that shows events that should be visible
-- This includes published events and events without a status (NULL)
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT
  USING (status = 'published' OR status IS NULL);
