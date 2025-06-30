
-- Add timezone column to events table with default value for existing events
ALTER TABLE public.events 
ADD COLUMN timezone VARCHAR(50) DEFAULT 'Europe/Amsterdam';

-- Update the column to be NOT NULL after setting the default
ALTER TABLE public.events 
ALTER COLUMN timezone SET NOT NULL;
