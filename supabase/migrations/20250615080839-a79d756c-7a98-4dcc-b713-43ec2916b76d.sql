
-- Add columns for reason and contact info to the creator_requests table
ALTER TABLE public.creator_requests
ADD COLUMN reason TEXT,
ADD COLUMN contact_email TEXT,
ADD COLUMN contact_phone TEXT;
