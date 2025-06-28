
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vibrant-aqua focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-1",
  {
    variants: {
      variant: {
        default: "bg-vibrant-aqua text-midnight hover:bg-vibrant-aqua/90 shadow-coastal",
        primary: "bg-vibrant-aqua text-midnight hover:bg-vibrant-aqua/90 shadow-coastal",
        secondary: "bg-clay text-coconut hover:bg-clay/90 shadow-coastal",
        accent: "bg-sunset-yellow text-midnight hover:bg-sunset-yellow/90 shadow-coastal",
        outline: "border border-sage/50 bg-transparent text-midnight hover:bg-sage/20 hover:border-clay/50",
        ghost: "text-midnight hover:bg-sage/20 hover:text-midnight",
        link: "text-ocean-deep hover:text-clay hover:underline underline-offset-4",
        destructive: "bg-clay text-coconut hover:bg-clay/90 shadow-coastal",
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
