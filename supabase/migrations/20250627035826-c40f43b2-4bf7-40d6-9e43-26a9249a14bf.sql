
-- Add columns to venues table to store address information if not already present
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS coordinates POINT;

-- Create a function to create venue from simple form data
CREATE OR REPLACE FUNCTION public.create_venue_from_simple_form(
  venue_name TEXT,
  venue_address TEXT,
  venue_city TEXT,
  creator_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  venue_id UUID;
BEGIN
  -- Insert new venue and return the ID
  INSERT INTO public.venues (name, address, city, creator_id)
  VALUES (venue_name, venue_address, venue_city, creator_user_id)
  RETURNING id INTO venue_id;
  
  RETURN venue_id;
END;
$$;
