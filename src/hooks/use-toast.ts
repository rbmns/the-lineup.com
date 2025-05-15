
import { toast as sonnerToast } from "sonner";
import { type ToasterToast } from "@/components/ui/toast";

// Simplified toast function that doesn't display any toasts
const toast = (options: ToasterToast | string) => {
  // For debugging purposes, log the toast request
  console.log('Toast request:', options);
  
  // Return a dummy id for compatibility
  return { id: Math.random().toString() };
};

// Mock useToast hook that doesn't actually show toasts
const useToast = () => ({
  toast,
  dismiss: () => {},
  toasts: [] as ToasterToast[],
});

export { toast, useToast };
