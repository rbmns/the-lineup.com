
-- Add a 'creator_id' column to the 'venues' table to track who created it.
-- This column will reference the 'id' from the 'profiles' table.
ALTER TABLE public.venues
ADD COLUMN creator_id UUID REFERENCES public.profiles(id);

-- Enable Row-Level Security on the 'venues' table.
-- This is a crucial security measure to control access to data.
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to view venues.
DROP POLICY IF EXISTS "Allow public read access to venues" ON public.venues;
CREATE POLICY "Allow public read access to venues"
ON public.venues
FOR SELECT
USING (true);

-- Create a policy that allows any logged-in user to create a new venue.
-- The 'creator_id' must match the ID of the user creating it.
DROP POLICY IF EXISTS "Allow authenticated users to create venues" ON public.venues;
CREATE POLICY "Allow authenticated users to create venues"
ON public.venues
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Create a policy that only allows the user who created a venue to update it.
DROP POLICY IF EXISTS "Allow creators to update their own venues" ON public.venues;
CREATE POLICY "Allow creators to update their own venues"
ON public.venues
FOR UPDATE
USING (auth.uid() = creator_id);

-- Create a policy that only allows the user who created a venue to delete it.
DROP POLICY IF EXISTS "Allow creators to delete their own venues" ON public.venues;
CREATE POLICY "Allow creators to delete their own venues"
ON public.venues
FOR DELETE
USING (auth.uid() = creator_id);
