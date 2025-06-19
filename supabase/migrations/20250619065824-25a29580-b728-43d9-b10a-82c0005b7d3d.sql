
-- Fix RLS policies for events table to ensure admins can see all events
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
DROP POLICY IF EXISTS "Event creators can view their own events" ON public.events;
DROP POLICY IF EXISTS "Event creators can create events" ON public.events;
DROP POLICY IF EXISTS "Admins can update any event" ON public.events;
DROP POLICY IF EXISTS "Event creators can update their own events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete any event" ON public.events;
DROP POLICY IF EXISTS "Event creators can delete their own events" ON public.events;

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
  USING (auth.uid() = creator AND public.has_role(auth.uid(), 'event_creator'));

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
  USING (auth.uid() = creator AND public.has_role(auth.uid(), 'event_creator'))
  WITH CHECK (auth.uid() = creator AND public.has_role(auth.uid(), 'event_creator'));

-- DELETE Policies
CREATE POLICY "Admins can delete any event" ON public.events
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Event creators can delete their own events" ON public.events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator AND public.has_role(auth.uid(), 'event_creator'));

-- Also fix admin_notifications RLS to ensure admins can see creator requests
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.admin_notifications;
CREATE POLICY "Admins can view all notifications" ON public.admin_notifications
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
