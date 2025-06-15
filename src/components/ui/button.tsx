
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Ensure text-ellipsis & consistent vertical/horizontal padding
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:shadow-md break-keep overflow-hidden text-ellipsis text-center select-none",
  {
    variants: {
      variant: {
        default:
          "bg-card text-card-foreground border hover:bg-secondary",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        dark: "bg-foreground text-background hover:bg-foreground/90",
      },
      size: {
        // Slightly reduce heights for a more unified look
        default: "min-w-[104px] h-11 px-5 py-2 text-base", // base default
        sm: "min-w-[88px] h-9 px-4 py-2 text-sm",
        // Unify "lg" height to not be visually thicker than default
        lg: "min-w-[120px] h-12 px-6 py-2.5 text-base", // was h-13, now h-12 (48px)
        icon: "min-w-[44px] h-11 w-11 p-0",
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
