
-- Add RLS policies for admin_notifications table
-- Allow admins to insert notifications
CREATE POLICY "Admins can insert notifications" 
  ON public.admin_notifications 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to read all notifications
CREATE POLICY "Admins can read all notifications" 
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

-- Allow admins to update notifications (mark as read, etc.)
CREATE POLICY "Admins can update notifications" 
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

-- Allow the system/service role to insert notifications (for when users request creator access)
CREATE POLICY "System can insert notifications" 
  ON public.admin_notifications 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);
