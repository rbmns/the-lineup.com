
-- Comprehensive fix for Portugal events with incorrect timestamps
-- This addresses the systematic issue where Portugal events are stored 1 hour earlier than they should be

-- First, let's fix all Portugal events where the timezone is 'Europe/Lisbon' 
-- and the stored UTC time doesn't match what it should be based on local time

-- For events in WEST period (last Sunday in March to last Sunday in October)
-- Local time should be UTC+1, so we need to ADD 1 hour to the stored timestamp
UPDATE events 
SET 
  start_datetime = start_datetime + INTERVAL '1 hour',
  end_datetime = CASE 
    WHEN end_datetime IS NOT NULL THEN end_datetime + INTERVAL '1 hour'
    ELSE NULL 
  END
WHERE 
  timezone = 'Europe/Lisbon'
  AND start_datetime IS NOT NULL
  AND (
    -- Events during WEST period (UTC+1)
    (EXTRACT(MONTH FROM start_datetime) > 3 AND EXTRACT(MONTH FROM start_datetime) < 10)
    OR 
    (EXTRACT(MONTH FROM start_datetime) = 3 AND EXTRACT(DAY FROM start_datetime) >= 25)
    OR
    (EXTRACT(MONTH FROM start_datetime) = 10 AND EXTRACT(DAY FROM start_datetime) < 25)
  )
  AND EXTRACT(HOUR FROM start_datetime AT TIME ZONE 'Europe/Lisbon') != EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp);

-- For events in WET period (last Sunday in October to last Sunday in March)  
-- Local time should be UTC+0, so the stored time should match local time
-- If it doesn't match, we also need to add 1 hour (same systematic error)
UPDATE events 
SET 
  start_datetime = start_datetime + INTERVAL '1 hour',
  end_datetime = CASE 
    WHEN end_datetime IS NOT NULL THEN end_datetime + INTERVAL '1 hour'
    ELSE NULL 
  END
WHERE 
  timezone = 'Europe/Lisbon'
  AND start_datetime IS NOT NULL
  AND (
    -- Events during WET period (UTC+0)
    (EXTRACT(MONTH FROM start_datetime) < 3)
    OR 
    (EXTRACT(MONTH FROM start_datetime) > 10)
    OR
    (EXTRACT(MONTH FROM start_datetime) = 3 AND EXTRACT(DAY FROM start_datetime) < 25)
    OR
    (EXTRACT(MONTH FROM start_datetime) = 10 AND EXTRACT(DAY FROM start_datetime) >= 25)
  )
  AND EXTRACT(HOUR FROM start_datetime AT TIME ZONE 'Europe/Lisbon') != EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp);

-- Add a check constraint to prevent future timestamp mismatches for Portugal events
-- This will help catch the issue at the database level
ALTER TABLE events 
ADD CONSTRAINT check_portugal_timezone_consistency 
CHECK (
  timezone != 'Europe/Lisbon' 
  OR start_datetime IS NULL 
  OR start_time IS NULL 
  OR start_date IS NULL
  OR ABS(
    EXTRACT(HOUR FROM start_datetime AT TIME ZONE timezone) - 
    EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp)
  ) < 1
);

-- Query to verify the fix worked
SELECT 
  id,
  title,
  start_date,
  start_time,
  start_datetime,
  timezone,
  EXTRACT(HOUR FROM start_datetime AT TIME ZONE timezone) as stored_local_hour,
  EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp) as expected_local_hour,
  CASE 
    WHEN ABS(EXTRACT(HOUR FROM start_datetime AT TIME ZONE timezone) - EXTRACT(HOUR FROM (start_date || 'T' || start_time)::timestamp)) < 1 
    THEN 'FIXED' 
    ELSE 'STILL_WRONG' 
  END as status
FROM events 
WHERE timezone = 'Europe/Lisbon'
  AND start_datetime IS NOT NULL 
  AND start_time IS NOT NULL
ORDER BY start_date;
