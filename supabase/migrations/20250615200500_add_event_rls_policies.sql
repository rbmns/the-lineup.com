
-- Enable Row-Level Security on the 'events' table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all events
DROP POLICY IF EXISTS "Allow public read access to events" ON public.events;
CREATE POLICY "Allow public read access to events"
ON public.events
FOR SELECT
USING (true);

-- Allow authenticated users with 'event_creator' or 'admin' role to insert events
DROP POLICY IF EXISTS "Allow event creators to insert events" ON public.events;
CREATE POLICY "Allow event creators to insert events"
ON public.events
FOR INSERT
WITH CHECK (
  auth.uid() = creator AND
  (public.has_role(auth.uid(), 'event_creator') OR public.has_role(auth.uid(), 'admin'))
);

-- Allow creators to update their own events, or admins to update any event
DROP POLICY IF EXISTS "Allow event creators or admins to update events" ON public.events;
CREATE POLICY "Allow event creators or admins to update events"
ON public.events
FOR UPDATE
USING (
  auth.uid() = creator OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  auth.uid() = creator OR public.has_role(auth.uid(), 'admin')
);

-- Allow creators to delete their own events, or admins to delete any event
DROP POLICY IF EXISTS "Allow event creators or admins to delete events" ON public.events;
CREATE POLICY "Allow event creators or admins to delete events"
ON public.events
FOR DELETE
USING (
  auth.uid() = creator OR public.has_role(auth.uid(), 'admin')
);
