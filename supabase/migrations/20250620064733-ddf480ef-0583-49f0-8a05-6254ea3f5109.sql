
-- Ensure the extra_info column exists with the correct name
-- First check if the old column name exists and rename it
DO $$
BEGIN
    -- Check if the old column name exists and rename it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND table_schema = 'public' 
        AND column_name = 'Extra info'
    ) THEN
        ALTER TABLE public.events RENAME COLUMN "Extra info" TO extra_info;
    END IF;
    
    -- If neither column exists, add the extra_info column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND table_schema = 'public' 
        AND (column_name = 'extra_info' OR column_name = 'Extra info')
    ) THEN
        ALTER TABLE public.events ADD COLUMN extra_info text;
    END IF;
END $$;
