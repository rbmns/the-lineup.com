-- Fix the generate_slug function to use start_datetime instead of start_date
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.slug := to_char(NEW.start_datetime, 'YYYY-MM-DD') || '-' || lower(replace(NEW.title, ' ', '-'));
    RETURN NEW;
END;
$function$;