
-- Step 1: Update all existing events to have status 'published' instead of null
UPDATE public.events 
SET status = 'published' 
WHERE status IS NULL;

-- Step 2: Set the default value for status column to 'published' for future events
ALTER TABLE public.events 
ALTER COLUMN status SET DEFAULT 'published';

-- Step 3: Make status column NOT NULL to prevent future null values
ALTER TABLE public.events 
ALTER COLUMN status SET NOT NULL;
