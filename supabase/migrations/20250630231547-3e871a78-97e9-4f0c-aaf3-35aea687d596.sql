
-- Add new timestamptz columns for start and end times (nullable initially)
ALTER TABLE events 
ADD COLUMN start_datetime timestamptz,
ADD COLUMN end_datetime timestamptz;

-- Migrate existing data by combining date, time, and timezone
-- Only update rows that have both start_date and start_time
UPDATE events 
SET start_datetime = (start_date::text || ' ' || start_time::text)::timestamp AT TIME ZONE COALESCE(timezone, 'Europe/Amsterdam')
WHERE start_date IS NOT NULL AND start_time IS NOT NULL;

-- Set end_datetime for events that have valid data
UPDATE events 
SET end_datetime = (
  CASE 
    WHEN end_date IS NOT NULL THEN end_date::text || ' ' || COALESCE(end_time::text, start_time::text)
    ELSE start_date::text || ' ' || COALESCE(end_time::text, start_time::text)
  END
)::timestamp AT TIME ZONE COALESCE(timezone, 'Europe/Amsterdam')
WHERE start_date IS NOT NULL AND (end_time IS NOT NULL OR start_time IS NOT NULL);

-- For events without proper date/time, set a default timestamp or handle them
-- Let's check what events are missing data first
UPDATE events 
SET start_datetime = NOW()
WHERE start_datetime IS NULL;

-- Now make start_datetime required for future events
ALTER TABLE events 
ALTER COLUMN start_datetime SET NOT NULL;

-- We'll keep the old columns for now to ensure no data loss during transition
-- They can be dropped later after confirming everything works correctly
