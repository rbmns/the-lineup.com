
import { toast as sonnerToast, useToast as useSonnerToast } from 'sonner';
import { type ToastProps } from '@/components/ui/toast';

// Enhanced toast function that accepts title and description
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  action?: React.ReactNode;
  icon?: React.ReactNode;
  duration?: number;
}

// Fixed toast function to properly handle string input and undefined options
const toast = (options: ToastOptions | string) => {
  if (typeof options === 'string') {
    // If options is a string, use it as the description
    return sonnerToast(options);
  }
  
  // Safely destructure with defaults to avoid undefined errors
  const { 
    title = '', 
    description, 
    variant = 'default', 
    action, 
    icon, 
    duration = 3000 
  } = options || {};
  
  // Use sonnerToast with proper parameters
  return sonnerToast(title, {
    description,
    icon,
    duration,
    // Map variant to sonner style if needed
    style: variant === 'destructive' ? { backgroundColor: '#FEE2E2', borderColor: '#EF4444' } : undefined,
    action,
  });
};

// Create properly typed useToast hook that returns the toast function
const useToast = () => {
  const sonnerHook = useSonnerToast();
  return { ...sonnerHook, toast };
};

export { toast, useToast };
