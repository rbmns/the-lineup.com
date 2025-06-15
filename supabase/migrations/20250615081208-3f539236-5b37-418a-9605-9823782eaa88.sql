
-- Create a table for admin notifications
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can create notifications
CREATE POLICY "Authenticated users can create notifications"
  ON public.admin_notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admins can view and manage all notifications
CREATE POLICY "Admins can manage notifications"
  ON public.admin_notifications
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
