
import { type ToasterToast } from '@/components/ui/toast';

// No-op toast function that doesn't actually display anything
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  action?: React.ReactNode;
  icon?: React.ReactNode;
  duration?: number;
}

// This is now a no-op function that returns an empty string as ID
const toast = (options: ToastOptions | string): string => {
  // We're intentionally not showing any toasts
  // Just return an empty ID
  return '';
};

// No-op useToast hook
const useToast = () => {
  return {
    toast,
    dismiss: () => {},
    toasts: [] as ToasterToast[],
  };
};

export { toast, useToast };
