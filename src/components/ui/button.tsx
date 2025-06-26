
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
        default: "bg-charcoal text-warm-neutral hover:bg-charcoal/90",
        primary: "bg-charcoal text-warm-neutral hover:bg-charcoal/90",
        secondary: "bg-clay-muted text-charcoal hover:bg-clay-muted/80",
        outline: "border border-clay bg-transparent text-charcoal hover:bg-clay-muted/30",
        ghost: "text-charcoal hover:bg-clay-muted/30",
        link: "text-charcoal hover:underline underline-offset-4",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        dark: "bg-charcoal text-warm-neutral hover:bg-charcoal/90",
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
