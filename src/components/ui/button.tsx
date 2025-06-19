
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getBorderRadiusClass, type BorderRadiusToken, defaultRadius } from "@/constants/design-tokens";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-center select-none",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-gray-800",
        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-gray-900 underline-offset-4 hover:underline",
        primary:
          "bg-black text-white hover:bg-gray-800",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        dark: "bg-black text-white hover:bg-gray-800",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 px-3 py-1.5 text-sm",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
      radius: {
        none: "",
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: defaultRadius.button,
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
  ({ className, variant, size, radius = defaultRadius.button, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const radiusClass = getBorderRadiusClass(radius);
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), radiusClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
