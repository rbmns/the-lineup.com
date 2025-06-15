
-- Create an enum type for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create the creator_requests table
CREATE TABLE public.creator_requests (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.request_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add comments to the table and columns
COMMENT ON TABLE public.creator_requests IS 'Stores requests from users to become event creators.';
COMMENT ON COLUMN public.creator_requests.user_id IS 'The ID of the user making the request.';
COMMENT ON COLUMN public.creator_requests.status IS 'The current status of the request.';

-- RLS Policies for creator_requests
ALTER TABLE public.creator_requests ENABLE ROW LEVEL SECURITY;

-- Users can create their own request
CREATE POLICY "Users can create their own creator request"
ON public.creator_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own request
CREATE POLICY "Users can view their own creator request"
ON public.creator_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger to update updated_at on row update
CREATE TRIGGER on_creator_requests_update
BEFORE UPDATE ON public.creator_requests
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
