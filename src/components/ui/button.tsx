
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:shadow-md",
  {
    variants: {
      variant: {
        // Standard button for most secondary actions.
        default:
          "bg-card text-card-foreground border hover:bg-secondary",
        // The main call-to-action button, using your deep ocean blue.
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        // For dangerous or destructive actions like deleting.
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // A less prominent button with a colored border.
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary/10",
        // A softer, filled button for tertiary actions.
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // For unstyled actions, often used for icon-only buttons.
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // A button that looks like a link.
        link: "text-primary underline-offset-4 hover:underline",
        // A dark variant for special cases needing high contrast.
        dark: "bg-foreground text-background hover:bg-foreground/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
