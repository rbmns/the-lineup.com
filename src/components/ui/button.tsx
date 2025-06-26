
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getBorderRadiusClass, type BorderRadiusToken } from "@/constants/design-tokens";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-clay text-midnight hover:bg-clay/80",
        primary: "bg-clay text-midnight hover:bg-clay/80",
        secondary: "bg-sage text-midnight hover:bg-sage/80",
        seafoam: "bg-seafoam text-midnight hover:bg-seafoam/80",
        outline: "border border-sage bg-transparent text-midnight hover:bg-sage/20",
        ghost: "text-midnight hover:bg-sage/20",
        link: "text-midnight hover:underline underline-offset-4",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-sm",
        lg: "px-6 py-3",
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
  radius?: BorderRadiusToken;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, radius = "sm", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }), 
          getBorderRadiusClass(radius),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
