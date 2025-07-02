-- Add pending status to the event_status enum (must be in separate transaction)
ALTER TYPE event_status ADD VALUE IF NOT EXISTS 'pending';