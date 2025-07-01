
-- Fix the RLS policies for events table to allow authenticated users to create events
-- while maintaining security for updates and deletes

-- Drop the restrictive policy that requires event_creator role for creation
DROP POLICY IF EXISTS "Event creators can create events" ON public.events;

-- Update the general "Users can create events" policy to be more permissive for creation
-- but still require the user to be the creator
DROP POLICY IF EXISTS "Users can create events" ON public.events;

-- Create a new policy that allows any authenticated user to create events
-- as long as they set themselves as the creator
CREATE POLICY "Authenticated users can create events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator);

-- Keep the existing policies for updates and deletes that require event_creator role
-- These are fine as they maintain proper security for modifications

-- Also ensure that the CreatorGuard component logic is updated to be less restrictive
-- by allowing authenticated users to create events even without the event_creator role initially
