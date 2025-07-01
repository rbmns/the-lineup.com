
-- Fix the RLS policies for events table to allow proper event creation
-- The current policies are conflicting and preventing event creation

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow event creation for authenticated and unauthenticated users" ON public.events;
DROP POLICY IF EXISTS "Event creators can delete their own events" ON public.events;
DROP POLICY IF EXISTS "Event creators can update their own events" ON public.events;
DROP POLICY IF EXISTS "Event creators can view their own events" ON public.events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;

-- Create a simple policy that allows any authenticated user to create events
-- and unauthenticated users to create events with null creator
CREATE POLICY "Allow authenticated users to create events"
ON public.events
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to create events (they set themselves as creator)
  (auth.uid() IS NOT NULL AND auth.uid() = creator) OR
  -- Allow unauthenticated users to create events (creator will be null initially)
  (auth.uid() IS NULL AND creator IS NULL)
);

-- Allow authenticated users to update their own events (no role requirement)
CREATE POLICY "Allow users to update their own events"
ON public.events
FOR UPDATE
USING (auth.uid() = creator)
WITH CHECK (auth.uid() = creator);

-- Allow authenticated users to delete their own events (no role requirement)
CREATE POLICY "Allow users to delete their own events"
ON public.events
FOR DELETE
USING (auth.uid() = creator);
