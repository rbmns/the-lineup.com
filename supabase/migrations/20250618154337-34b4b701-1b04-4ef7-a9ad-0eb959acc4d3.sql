
-- First, let's check the current RLS policies on the events table and fix them

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Allow public read access to events" ON public.events;
DROP POLICY IF EXISTS "Allow event creators to insert events" ON public.events;
DROP POLICY IF EXISTS "Allow event creators to update their own events" ON public.events;
DROP POLICY IF EXISTS "Allow event creators to delete their own events" ON public.events;
DROP POLICY IF EXISTS "Allow event creators or admins to update events" ON public.events;
DROP POLICY IF EXISTS "Allow event creators or admins to delete events" ON public.events;
DROP POLICY IF EXISTS "Admins can see all events" ON public.events;
DROP POLICY IF EXISTS "Creators can see their own events" ON public.events;
DROP POLICY IF EXISTS "Public can see published events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Admins can update any event" ON public.events;
DROP POLICY IF EXISTS "Creators can update their own non-published events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete any event" ON public.events;
DROP POLICY IF EXISTS "Creators can delete their own non-published events" ON public.events;

-- Create comprehensive RLS policies for the events table
-- SELECT Policies
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Event creators can view their own events" ON public.events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator);

-- INSERT Policies
CREATE POLICY "Event creators can create events" ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator AND
    (public.has_role(auth.uid(), 'event_creator') OR public.has_role(auth.uid(), 'admin'))
  );

-- UPDATE Policies
CREATE POLICY "Admins can update any event" ON public.events
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Event creators can update their own events" ON public.events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator)
  WITH CHECK (auth.uid() = creator);

-- DELETE Policies
CREATE POLICY "Admins can delete any event" ON public.events
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Event creators can delete their own events" ON public.events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator);
