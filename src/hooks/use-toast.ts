
import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
};

export function toast({ title, description, action, variant }: ToastProps) {
  // Map our variants to sonner variants
  const sonnerVariant = variant === 'destructive' ? 'error' : 
                       variant === 'success' ? 'success' : 
                       'default';
  
  return sonnerToast(title, {
    description,
    action,
    className: `toast-${variant || 'default'}`,
  });
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: (title: string, description?: string) => toast({ 
      title, 
      description, 
      variant: 'destructive' 
    }),
    success: (title: string, description?: string) => toast({ 
      title, 
      description, 
      variant: 'success' 
    })
  };
};
