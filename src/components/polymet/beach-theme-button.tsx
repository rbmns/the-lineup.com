import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { beachLifeColors } from "@/components/polymet/beach-life-color-palette";

const beachButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#0891B2] text-white hover:bg-[#0E7490] focus-visible:ring-[#0891B2]",
        secondary:
          "bg-[#F59E0B] text-white hover:bg-[#D97706] focus-visible:ring-[#F59E0B]",
        outline:
          "border border-[#0891B2] bg-transparent hover:bg-[#ECFEFF] text-[#0891B2]",
        ghost: "hover:bg-[#ECFEFF] text-[#0891B2] hover:text-[#0E7490]",
        link: "text-[#0891B2] underline-offset-4 hover:underline",
        coral:
          "bg-[#F43F5E] text-white hover:bg-[#E11D48] focus-visible:ring-[#F43F5E]",
        turquoise:
          "bg-[#06B6D4] text-white hover:bg-[#0891B2] focus-visible:ring-[#06B6D4]",
        lime: "bg-[#84CC16] text-white hover:bg-[#65A30D] focus-visible:ring-[#84CC16]",
        sunset:
          "bg-gradient-to-r from-[#F43F5E] to-[#8B5CF6] text-white hover:opacity-90",
        ocean:
          "bg-gradient-to-r from-[#0891B2] to-[#22D3EE] text-white hover:opacity-90",
        beach:
          "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white hover:opacity-90",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        xl: "h-12 px-10 rounded-md text-base",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface BeachThemeButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof beachButtonVariants> {
  asChild?: boolean;
}

const BeachThemeButton = forwardRef<HTMLButtonElement, BeachThemeButtonProps>(
  ({ className, variant, size, rounded, ...props }, ref) => {
    return (
      <button
        className={cn(
          beachButtonVariants({ variant, size, rounded, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

BeachThemeButton.displayName = "BeachThemeButton";

export { BeachThemeButton, beachButtonVariants };
