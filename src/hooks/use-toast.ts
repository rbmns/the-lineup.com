
// Re-export toast components and utilities
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

// Import and re-export the toast utilities from shadcn's toast implementation
export { useToast } from "@/components/ui/toast"

// Re-export sonner toast for convenience
export { toast } from "sonner"

export type ToastActionProps = React.ComponentPropsWithoutRef<typeof ToastActionElement>

export interface ToastOwnProps extends ToastProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  icon?: React.ReactNode
}
