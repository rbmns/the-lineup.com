
import { useToast as useToastOriginal } from "@/components/ui/toast";
import { toast as toastOriginal, type ToastProps } from "@/components/ui/toast";

// Re-export toast functionality with enhanced behavior
export const useToast = () => {
  const originalToastHook = useToastOriginal();

  // Return original hook but we could enhance it in the future
  return originalToastHook;
};

// Create a debounced version of the toast function to prevent duplicate toasts
let lastToastMessage = '';
let lastToastTimestamp = 0;

// Modified toast function that handles ToastProps correctly
export const toast = (props: ToastProps) => {
  // If toast is called with the same message within 2 seconds, ignore it
  const currentTime = Date.now();
  const message = typeof props === 'string' 
    ? props 
    : (props?.description?.toString() || props?.title?.toString() || '');
  
  if (message === lastToastMessage && currentTime - lastToastTimestamp < 2000) {
    console.log('Prevented duplicate toast:', message);
    return;
  }
  
  // Update last toast tracking
  lastToastMessage = message;
  lastToastTimestamp = currentTime;
  
  // Call the original toast function
  return toastOriginal(props);
};

export type { ToastProps };
