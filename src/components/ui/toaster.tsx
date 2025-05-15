
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"

// Simplified Toaster that doesn't actually render any toasts
export function Toaster() {
  return (
    <ToastProvider>
      {/* No toasts will be rendered */}
      <ToastViewport className="fixed top-4 right-4 flex flex-col gap-2 p-4 w-full max-w-[380px] m-0 list-none z-[100] outline-none" />
    </ToastProvider>
  )
}
