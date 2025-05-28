import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { bohemianColors } from "@/polymet/components/bohemian-color-palette";

const bohemianButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-secondary hover:bg-primary-medium focus-visible:ring-primary",
        terracotta:
          "bg-earth-terracotta text-secondary hover:bg-earth-clay focus-visible:ring-earth-terracotta",
        teal: "bg-accent-teal text-secondary hover:bg-accent-teal/90 focus-visible:ring-accent-teal",
        ochre:
          "bg-accent-ochre text-primary hover:bg-accent-ochre/90 focus-visible:ring-accent-ochre",
        sage: "bg-accent-sage text-secondary hover:bg-accent-sage/90 focus-visible:ring-accent-sage",
        indigo:
          "bg-accent-indigo text-secondary hover:bg-accent-indigo/90 focus-visible:ring-accent-indigo",
        outline:
          "border border-primary bg-transparent hover:bg-secondary text-primary",
        ghost: "hover:bg-secondary text-primary hover:text-primary",
        link: "text-accent-teal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-11 px-8 py-2.5 text-base",
        xl: "h-12 px-10 py-3 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      hasIcon: {
        true: "inline-flex items-center gap-2",
        false: "",
      },
      textStyle: {
        default: "font-medium",
        serif: "font-serif",
        uppercase: "uppercase tracking-wider text-xs font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      hasIcon: false,
      textStyle: "default",
    },
  }
);

export interface BohemianButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof bohemianButtonVariants> {
  asChild?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const BohemianButton = forwardRef<HTMLButtonElement, BohemianButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      textStyle,
      hasIcon: _,
      asChild = false,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const hasIcon = !!(iconLeft || iconRight);

    return (
      <Comp
        className={cn(
          bohemianButtonVariants({
            variant,
            size,
            rounded,
            hasIcon,
            textStyle,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </Comp>
    );
  }
);

BohemianButton.displayName = "BohemianButton";

export { BohemianButton, bohemianButtonVariants };
