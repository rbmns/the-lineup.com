
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vibrant-aqua focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-1",
  {
    variants: {
      variant: {
        default: "btn-primary",
        primary: "btn-primary", 
        secondary: "btn-secondary",
        accent: "btn-accent",
        outline: "btn-outline",
        ghost: "btn-ghost",
        link: "text-ocean-deep hover:text-clay hover:underline underline-offset-4 hover:translate-y-0",
        destructive: "btn-secondary", // Use clay instead of harsh red
      },
      size: {
        default: "px-4 py-2.5 h-10",
        sm: "px-3 py-2 h-9 text-sm",
        lg: "px-6 py-3 h-12 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
