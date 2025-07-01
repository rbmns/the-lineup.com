
-- Fix the venue creation policy to allow unauthenticated users to create venues
-- Drop the existing policy that requires authentication
DROP POLICY IF EXISTS "Allow venue creation for authenticated and unauthenticated user" ON public.venues;

-- Create a new policy that properly allows both authenticated and unauthenticated venue creation
CREATE POLICY "Allow venue creation for all users" 
ON public.venues 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and owns the venue
  (auth.uid() IS NOT NULL AND auth.uid() = creator_id) 
  OR 
  -- Allow if user is not authenticated and creator_id is null
  (auth.uid() IS NULL AND creator_id IS NULL)
);
