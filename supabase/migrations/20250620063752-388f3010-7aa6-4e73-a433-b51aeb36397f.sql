
-- First, let's check and fix the RLS policies for admin_notifications
-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admins can manage notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admins can read all notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.admin_notifications;

-- Create proper RLS policies for admin_notifications
-- Allow any authenticated user to insert notifications (for creator requests)
CREATE POLICY "Allow authenticated users to insert notifications"
  ON public.admin_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow admins to read all notifications
CREATE POLICY "Allow admins to read notifications"
  ON public.admin_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to update notifications (mark as read)
CREATE POLICY "Allow admins to update notifications"
  ON public.admin_notifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Also check creator_requests policies
-- Allow users to insert their own requests
CREATE POLICY "Users can insert their own creator requests"
  ON public.creator_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own requests
CREATE POLICY "Users can view their own creator requests"
  ON public.creator_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to view all creator requests
CREATE POLICY "Admins can view all creator requests"
  ON public.creator_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to update creator requests (approve/deny)
CREATE POLICY "Admins can update creator requests"
  ON public.creator_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
