
-- Update the RLS policy to allow unauthenticated users to create events
-- This will enable the flow where users can create events and then be prompted to authenticate

-- Drop the current policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;

-- Create a new policy that allows both authenticated and unauthenticated users to create events
-- For authenticated users: they must set themselves as the creator
-- For unauthenticated users: creator can be null initially
CREATE POLICY "Allow event creation for authenticated and unauthenticated users"
ON public.events
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to create events with their user ID
  (auth.uid() IS NOT NULL AND auth.uid() = creator) OR
  -- Allow unauthenticated users to create events with NULL creator initially
  (auth.uid() IS NULL AND creator IS NULL)
);
