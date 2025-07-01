
-- First, let's see the current state of venues and their country data
-- (excluding coordinates from GROUP BY since point type doesn't support equality)
SELECT 
  v.id,
  v.name,
  v.city,
  v.country,
  COUNT(e.id) as event_count
FROM venues v
LEFT JOIN events e ON e.venue_id = v.id
GROUP BY v.id, v.name, v.city, v.country
ORDER BY event_count DESC
LIMIT 20;

-- Update events timezone based on venue country first (most reliable)
UPDATE events 
SET timezone = CASE 
  WHEN v.country = 'Portugal' THEN 'Europe/Lisbon'
  WHEN v.country = 'Netherlands' THEN 'Europe/Amsterdam'
  WHEN v.country = 'Germany' THEN 'Europe/Berlin'
  WHEN v.country = 'France' THEN 'Europe/Paris'
  WHEN v.country = 'Spain' THEN 'Europe/Madrid'
  WHEN v.country = 'United Kingdom' THEN 'Europe/London'
  WHEN v.country = 'Italy' THEN 'Europe/Rome'
  WHEN v.country = 'Belgium' THEN 'Europe/Brussels'
  WHEN v.country = 'Switzerland' THEN 'Europe/Zurich'
  WHEN v.country = 'Austria' THEN 'Europe/Vienna'
  ELSE 'Europe/Amsterdam' -- fallback
END
FROM venues v
WHERE events.venue_id = v.id 
  AND v.country IS NOT NULL
  AND events.timezone = 'Europe/Amsterdam';

-- For venues without country but with city in our city_timezones table
-- Only update if the city+country combination exists in our lookup table
UPDATE events 
SET timezone = ct.timezone
FROM venues v
JOIN city_timezones ct ON LOWER(v.city) = LOWER(ct.city_name)
WHERE events.venue_id = v.id 
  AND v.country IS NULL
  AND events.timezone = 'Europe/Amsterdam'
  -- Additional safety: only update if we have a high-confidence match
  AND ct.city_name IN (
    'Amsterdam', 'Lisbon', 'Lisboa', 'Porto', 'Ericeira', 
    'Berlin', 'Paris', 'Madrid', 'Rome', 'London'
  );

-- Update venue countries that are missing but can be inferred from city_timezones
UPDATE venues 
SET country = ct.country_name
FROM city_timezones ct
WHERE LOWER(venues.city) = LOWER(ct.city_name)
  AND venues.country IS NULL
  AND ct.city_name IN (
    'Amsterdam', 'Lisbon', 'Lisboa', 'Porto', 'Ericeira',
    'Zandvoort', 'Haarlem', 'Berlin', 'Paris', 'Madrid'
  );

-- Create a function to safely get timezone by country (for future use)
CREATE OR REPLACE FUNCTION get_timezone_by_country(country_name text)
RETURNS text AS $$
BEGIN
  RETURN CASE 
    WHEN LOWER(country_name) IN ('portugal') THEN 'Europe/Lisbon'
    WHEN LOWER(country_name) IN ('netherlands', 'holland') THEN 'Europe/Amsterdam'
    WHEN LOWER(country_name) IN ('germany', 'deutschland') THEN 'Europe/Berlin'
    WHEN LOWER(country_name) IN ('france') THEN 'Europe/Paris'
    WHEN LOWER(country_name) IN ('spain', 'españa') THEN 'Europe/Madrid'
    WHEN LOWER(country_name) IN ('united kingdom', 'uk', 'england', 'scotland', 'wales') THEN 'Europe/London'
    WHEN LOWER(country_name) IN ('italy', 'italia') THEN 'Europe/Rome'
    WHEN LOWER(country_name) IN ('belgium', 'belgië') THEN 'Europe/Brussels'
    WHEN LOWER(country_name) IN ('switzerland', 'schweiz') THEN 'Europe/Zurich'
    WHEN LOWER(country_name) IN ('austria', 'österreich') THEN 'Europe/Vienna'
    ELSE 'Europe/Amsterdam' -- safe fallback
  END;
END;
$$ LANGUAGE plpgsql;
