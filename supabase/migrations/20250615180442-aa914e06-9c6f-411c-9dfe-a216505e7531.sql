
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Users can create events as themselves" ON public.events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;

-- Recreate all policies with correct names
CREATE POLICY "Allow public read access to events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Allow event creators to insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = creator);

CREATE POLICY "Allow event creators to update their own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = creator)
  WITH CHECK (auth.uid() = creator);

CREATE POLICY "Allow event creators to delete their own events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = creator);
