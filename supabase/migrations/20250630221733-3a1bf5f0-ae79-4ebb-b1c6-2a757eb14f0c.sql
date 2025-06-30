
-- Add country column to venues table
ALTER TABLE venues ADD COLUMN country text;

-- Create timezone mapping table for cities
CREATE TABLE city_timezones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name text NOT NULL,
  country_code text NOT NULL,
  country_name text NOT NULL,
  timezone text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(city_name, country_code)
);

-- Insert common timezone mappings
INSERT INTO city_timezones (city_name, country_code, country_name, timezone) VALUES
  -- Portugal
  ('Ericeira', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Lisboa', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Lisbon', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Porto', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Cascais', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Sintra', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Peniche', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Nazaré', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Óbidos', 'PT', 'Portugal', 'Europe/Lisbon'),
  ('Obidos', 'PT', 'Portugal', 'Europe/Lisbon'),
  
  -- Netherlands
  ('Zandvoort', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Amsterdam', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Haarlem', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Leiden', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('The Hague', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Den Haag', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Rotterdam', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Utrecht', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Eindhoven', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  ('Groningen', 'NL', 'Netherlands', 'Europe/Amsterdam'),
  
  -- Common European cities
  ('Berlin', 'DE', 'Germany', 'Europe/Berlin'),
  ('Paris', 'FR', 'France', 'Europe/Paris'),
  ('Madrid', 'ES', 'Spain', 'Europe/Madrid'),
  ('Rome', 'IT', 'Italy', 'Europe/Rome'),
  ('London', 'GB', 'United Kingdom', 'Europe/London'),
  ('Barcelona', 'ES', 'Spain', 'Europe/Madrid'),
  ('Munich', 'DE', 'Germany', 'Europe/Berlin'),
  ('Vienna', 'AT', 'Austria', 'Europe/Vienna'),
  ('Zurich', 'CH', 'Switzerland', 'Europe/Zurich'),
  ('Brussels', 'BE', 'Belgium', 'Europe/Brussels');

-- Update existing venues with country information based on city
UPDATE venues 
SET country = ctz.country_name
FROM city_timezones ctz
WHERE LOWER(venues.city) = LOWER(ctz.city_name);

-- Create function to get timezone for a city
CREATE OR REPLACE FUNCTION get_city_timezone(city_name text)
RETURNS text AS $$
DECLARE
  detected_timezone text;
BEGIN
  -- Try exact match first
  SELECT timezone INTO detected_timezone
  FROM city_timezones
  WHERE LOWER(city_timezones.city_name) = LOWER(city_name)
  LIMIT 1;
  
  -- If not found, try partial match
  IF detected_timezone IS NULL THEN
    SELECT timezone INTO detected_timezone
    FROM city_timezones
    WHERE LOWER(city_timezones.city_name) LIKE '%' || LOWER(city_name) || '%'
    LIMIT 1;
  END IF;
  
  -- Default to Europe/Amsterdam if nothing found
  RETURN COALESCE(detected_timezone, 'Europe/Amsterdam');
END;
$$ LANGUAGE plpgsql;

-- Create function to get country for a city
CREATE OR REPLACE FUNCTION get_city_country(city_name text)
RETURNS text AS $$
DECLARE
  detected_country text;
BEGIN
  -- Try exact match first
  SELECT country_name INTO detected_country
  FROM city_timezones
  WHERE LOWER(city_timezones.city_name) = LOWER(city_name)
  LIMIT 1;
  
  -- If not found, try partial match
  IF detected_country IS NULL THEN
    SELECT country_name INTO detected_country
    FROM city_timezones
    WHERE LOWER(city_timezones.city_name) LIKE '%' || LOWER(city_name) || '%'
    LIMIT 1;
  END IF;
  
  RETURN detected_country;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set country and categorize venues
CREATE OR REPLACE FUNCTION auto_categorize_venue()
RETURNS TRIGGER AS $$
DECLARE
  detected_country text;
  detected_timezone text;
  target_area_id uuid;
BEGIN
  -- Get country and timezone for the city
  detected_country := get_city_country(NEW.city);
  detected_timezone := get_city_timezone(NEW.city);
  
  -- Set country if detected
  IF detected_country IS NOT NULL THEN
    NEW.country := detected_country;
  END IF;
  
  -- Auto-categorize to areas based on country
  IF detected_country = 'Portugal' THEN
    SELECT id INTO target_area_id FROM venue_areas WHERE LOWER(name) LIKE '%ericeira%' LIMIT 1;
  ELSIF detected_country = 'Netherlands' THEN
    SELECT id INTO target_area_id FROM venue_areas WHERE LOWER(name) LIKE '%zandvoort%' LIMIT 1;
  END IF;
  
  -- Add city to area mapping if area found
  IF target_area_id IS NOT NULL AND NEW.city IS NOT NULL THEN
    INSERT INTO venue_city_areas (city_name, area_id)
    VALUES (NEW.city, target_area_id)
    ON CONFLICT (city_name, area_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new venues
DROP TRIGGER IF EXISTS trigger_auto_categorize_venue ON venues;
CREATE TRIGGER trigger_auto_categorize_venue
  BEFORE INSERT OR UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION auto_categorize_venue();
