-- Add missing location columns to events table to fix event creation
-- These columns will store venue/address information directly in the events table

ALTER TABLE public.events 
ADD COLUMN venue_name text,
ADD COLUMN address text,
ADD COLUMN postal_code text;