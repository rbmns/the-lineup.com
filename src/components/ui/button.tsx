
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-ocean-deep text-coconut hover:bg-ocean-deep/90 shadow-coastal",
        primary: "bg-ocean-deep text-coconut hover:bg-ocean-deep/90 shadow-coastal",
        secondary: "bg-clay text-ocean-deep hover:bg-clay/90 shadow-coastal",
        accent: "bg-vibrant-aqua text-ocean-deep hover:bg-vibrant-aqua/90 shadow-coastal",
        outline: "border border-ocean-deep/20 bg-transparent text-ocean-deep hover:bg-vibrant-aqua/10 hover:border-vibrant-aqua/40",
        ghost: "text-ocean-deep hover:bg-vibrant-aqua/10 hover:text-ocean-deep",
        link: "text-ocean-deep hover:text-vibrant-aqua hover:underline underline-offset-4",
        destructive: "bg-destructive text-coconut hover:bg-destructive/90 shadow-coastal",
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
