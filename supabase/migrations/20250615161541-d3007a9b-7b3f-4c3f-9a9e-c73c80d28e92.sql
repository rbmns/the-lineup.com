
-- This script adds the standard event vibes to the database.
-- The ON CONFLICT clause prevents creating duplicates if they already exist.
INSERT INTO public.event_vibe (name)
VALUES
  ('party'),
  ('chill'),
  ('wellness'),
  ('active'),
  ('social'),
  ('creative')
ON CONFLICT (name) DO NOTHING;
