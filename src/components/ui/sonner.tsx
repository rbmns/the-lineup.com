
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { toast } from "@/hooks/use-toast"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group fixed z-[100]"
      position="top-right"
      expand={false}
      closeButton={true}
      richColors={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "bg-green-50 border-green-500 text-green-700",
          error: "bg-red-50 border-red-500 text-red-700",
          warning: "bg-amber-50 border-amber-500 text-amber-700", 
          info: "bg-blue-50 border-blue-500 text-blue-700",
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

// Export Toaster and toast
export { Toaster, toast }
