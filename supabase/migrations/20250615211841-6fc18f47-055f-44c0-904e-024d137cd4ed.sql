
-- Create an ENUM type for event status
CREATE TYPE public.event_status AS ENUM ('draft', 'pending_approval', 'published', 'rejected');

-- Add the status column to the events table with a default
ALTER TABLE public.events ADD COLUMN status public.event_status DEFAULT 'draft';

-- Update existing events to have 'published' status so they remain visible
UPDATE public.events SET status = 'published';

-- Make the status column not-null
ALTER TABLE public.events ALTER COLUMN status SET NOT NULL;

-- Enable Row-Level Security on the events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- SELECT Policies
CREATE POLICY "Admins can see all events" ON public.events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can see their own events" ON public.events FOR SELECT
  USING (auth.uid() = creator);

CREATE POLICY "Public can see published events" ON public.events FOR SELECT
  USING (status = 'published');

-- INSERT Policies
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT
  WITH CHECK (auth.uid() = creator);

-- UPDATE Policies
CREATE POLICY "Admins can update any event" ON public.events FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can update their own non-published events" ON public.events FOR UPDATE
  USING (auth.uid() = creator AND status != 'published')
  WITH CHECK (auth.uid() = creator);

-- DELETE Policies
CREATE POLICY "Admins can delete any event" ON public.events FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can delete their own non-published events" ON public.events FOR DELETE
  USING (auth.uid() = creator AND status != 'published');
