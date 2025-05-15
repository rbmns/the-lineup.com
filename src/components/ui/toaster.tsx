import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  // Define patterns to filter out most toast notifications
  const titleFilters = [
    "Successfully logged in",
    "Signed out", 
    "RSVP",
    "Going",
    "Interested",
    "Filter applied",
    "cleared",
    "updated",
    "filter removed",
    "Friend request",
    "friend request",
    "Logged in",
    "Login successful",
    "Created",
    "Updated",
    "Deleted"
  ];
  
  const descriptionFilters = [
    "You are now logged in",
    "RSVP",
    "Going",
    "Interested",
    "successfully logged out",
    "filter",
    "Filter",
    "You are now friends",
    "friend request",
    "logged in",
    "welcome back",
    "Welcome back",
    "account",
    "created",
    "updated",
    "removed"
  ];

  // A function to check if a string matches any pattern in a filter array
  const matchesFilter = (text: string | React.ReactNode, filters: string[]): boolean => {
    if (typeof text !== 'string') return false;
    return filters.some(filter => text.toLowerCase().includes(filter.toLowerCase()));
  };

  return (
    <ToastProvider>
      {toasts
        .filter(toast => {
          // Keep toasts for accepted friend requests and critical errors
          const isAcceptedFriendRequest = toast.title === "Friend request accepted";
          const isCriticalError = toast.variant === "destructive";
          const isLinkCopied = typeof toast.description === 'string' && toast.description.includes("copied to clipboard");
          
          // If it's specifically for accepted friend requests or critical errors, keep it
          if (isAcceptedFriendRequest || isCriticalError || isLinkCopied) return true;
          
          // Filter out common toast notifications
          const shouldFilterTitle = toast.title && matchesFilter(toast.title, titleFilters);
          const shouldFilterDesc = toast.description && matchesFilter(toast.description, descriptionFilters);
          
          // Keep the toast only if it doesn't match any filter
          return !shouldFilterTitle && !shouldFilterDesc;
        })
        .map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast 
              key={id} 
              {...props}
              className="p-4 border-2 border-gray-800 bg-white shadow-sm scale-in"
              // Shorter duration for better UX
              duration={1800}
              // Ensure toast doesn't block content
              style={{ zIndex: 1000 }}
            >
              <div className="grid gap-1">
                {props.icon && (
                  <div className="absolute left-4 top-4">
                    {props.icon}
                  </div>
                )}
                <div className={props.icon ? "pl-6" : ""}>
                  {title && <ToastTitle className="text-sm font-bold text-black">{title}</ToastTitle>}
                  {description && typeof description === 'string' && (
                    <ToastDescription className="text-xs text-gray-600">{description}</ToastDescription>
                  )}
                </div>
              </div>
              {action}
              <ToastClose className="h-4 w-4 opacity-70 hover:opacity-100" />
            </Toast>
          )
        })}
      <ToastViewport className="fixed top-4 right-4 flex flex-col gap-2 p-4 w-full max-w-[380px] m-0 list-none z-[100] outline-none pointer-events-auto" />
    </ToastProvider>
  )
}
