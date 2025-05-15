
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

// Import the useToast hook from toast.tsx
import { useToast, toast as toastPrimitive } from "@/components/ui/toast"

// Re-export sonner toast for convenience
import { toast as sonnerToast } from "sonner"

// Create a unified toast API
export const toast = sonnerToast;

// Export the useToast hook
export { useToast }

export type ToastActionProps = React.ComponentPropsWithoutRef<typeof ToastActionElement>

export interface ToastOwnProps extends ToastProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  icon?: React.ReactNode
}
