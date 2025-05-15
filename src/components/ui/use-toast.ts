
// This file redirects to the toast component implementation
import { useToast as useToastOriginal, toast as toastOriginal, type ToastProps } from "@/components/ui/toast";

// Enhance toast with more standardized API
export const toast = (props: ToastProps | { description: string, title?: string, variant?: "default" | "destructive" }) => {
  return toastOriginal(props);
};

export const useToast = useToastOriginal;
export type { ToastProps };
