-- Fix the generate_event_slug function to use start_datetime instead of start_date
CREATE OR REPLACE FUNCTION public.generate_event_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if start_datetime and title are not NULL
    IF NEW.start_datetime IS NOT NULL AND NEW.title IS NOT NULL THEN
        NEW.slug := TO_CHAR(NEW.start_datetime, 'YYYY-MM-DD') || '-' || LOWER(REPLACE(NEW.title, ' ', '-'));
    END IF;
    RETURN NEW;
END;
$function$;