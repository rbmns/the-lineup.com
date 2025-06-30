
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-montserrat font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn-primary",
        primary: "btn-primary", 
        secondary: "btn-secondary",
        outline: "btn-secondary", // Use secondary styling for outline
        ghost: "bg-transparent text-graphite-grey hover:bg-mist-grey hover:text-graphite-grey",
        link: "text-ocean-teal hover:text-graphite-grey hover:underline underline-offset-4 hover:scale-100", // Override scale for links
        destructive: "bg-red-500 text-pure-white hover:bg-red-600",
        accent: "bg-sunrise-ochre text-graphite-grey hover:opacity-90 hover:scale-101",
      },
      size: {
        default: "px-6 py-3 text-base", // Generous padding as specified
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
        icon: "h-10 w-10",
      },
      radius: {
        sm: "rounded-sm",
        md: "rounded-md", // Default
        lg: "rounded-lg", 
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, radius }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
