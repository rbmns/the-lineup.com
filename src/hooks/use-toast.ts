
import { toast as sonnerToast } from "sonner";
import { type ToasterToast } from "@/components/ui/toast";

// Simplified toast function that doesn't display any toasts but maintains API compatibility
const toast = (options: ToasterToast | string) => {
  // For debugging purposes, log the toast request
  if (typeof options === 'string') {
    console.log('Toast request (message):', options);
  } else {
    console.log('Toast request (object):', options);
  }
  
  // Generate a random ID for compatibility
  const toastId = Math.random().toString(36).substring(2, 11);
  
  // Return the ID for proper typing
  return { id: toastId };
};

// Mock useToast hook that doesn't actually show toasts but maintains API compatibility
const useToast = () => ({
  toast,
  // Dummy dismiss function
  dismiss: (id?: string) => {
    if (id) {
      console.log(`Toast dismissed: ${id}`);
    } else {
      console.log('All toasts dismissed');
    }
  },
  // Empty toast array for compatibility
  toasts: [] as ToasterToast[],
});

export { toast, useToast };
