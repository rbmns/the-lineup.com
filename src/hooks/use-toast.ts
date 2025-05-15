
import { toast as sonnerToast } from "sonner";
import { type ToasterToast } from "@/components/ui/toast";

/**
 * A simplified toast function that doesn't actually display toasts,
 * but maintains API compatibility with the original toast function.
 * 
 * It handles both string messages and toast objects, and automatically
 * adds an ID if one isn't provided.
 */
const toast = (options: ToasterToast | string) => {
  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 11);
  
  // Process input options
  let toastOptions: ToasterToast;
  
  if (typeof options === 'string') {
    // If it's a string, create a toast object with description
    toastOptions = { description: options, id };
    console.log('Toast request (message):', options);
  } else {
    // If it's already an object, add an ID if missing
    toastOptions = { ...options, id: options.id || id };
    console.log('Toast request (object):', options);
  }
  
  return { id: toastOptions.id };
};

/**
 * A mock implementation of the useToast hook that doesn't actually show toasts
 * but maintains API compatibility with the original.
 */
const useToast = () => ({
  toast,
  // Dummy dismiss function that logs the action
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
