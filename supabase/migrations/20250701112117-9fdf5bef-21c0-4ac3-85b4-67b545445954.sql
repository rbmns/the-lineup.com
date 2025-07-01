
-- Fix the November 8th event that should start at 10:00 AM Lisbon time
-- During November, Portugal is in WET (UTC+0), so 10:00 AM local = 10:00 AM UTC
UPDATE events 
SET 
  start_datetime = '2025-11-08T10:00:00+00:00',
  end_datetime = '2025-11-08T12:00:00+00:00'
WHERE id = '22600fd1-ff27-4653-a39a-4def487d4145';

-- You can also check for other events that might have similar timezone conversion issues
-- This query will show events where the timestampz fields don't match the legacy time fields
SELECT 
  id,
  title,
  start_date,
  start_time,
  start_datetime,
  timezone,
  EXTRACT(HOUR FROM start_datetime AT TIME ZONE COALESCE(timezone, 'Europe/Amsterdam')) as extracted_hour,
  EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp) as legacy_hour
FROM events 
WHERE 
  start_datetime IS NOT NULL 
  AND start_time IS NOT NULL
  AND EXTRACT(HOUR FROM start_datetime AT TIME ZONE COALESCE(timezone, 'Europe/Amsterdam')) != EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp)
ORDER BY start_date;
