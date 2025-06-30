
-- Update the INSERT policy on venues table to allow unauthenticated users to create venues
-- This replaces the existing policy to allow both authenticated and unauthenticated venue creation
DROP POLICY IF EXISTS "Allow authenticated users to create venues" ON public.venues;

CREATE POLICY "Allow venue creation for authenticated and unauthenticated users"
ON public.venues
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to create venues with their user ID
  (auth.uid() IS NOT NULL AND auth.uid() = creator_id) OR
  -- Allow unauthenticated users to create venues with NULL creator_id
  (auth.uid() IS NULL AND creator_id IS NULL)
);
