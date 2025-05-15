
import { toast as sonnerToast } from 'sonner';
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

const toast = (options: ToastOptions | string) => {
  if (typeof options === 'string') {
    return sonnerToast(options);
  }
  
  const { title, description, variant, action, icon, duration } = options;
  
  return sonnerToast(title || '', {
    description,
    icon,
    duration: duration || 3000,
    // Map variants to sonner's style if needed
    // Add any additional props needed
  });
};

// Re-expose the useToast hook from sonner for consistency
export { toast, toast as useToast };
