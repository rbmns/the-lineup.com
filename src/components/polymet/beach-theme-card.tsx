import { cn } from "@/lib/utils";
import { beachLifeColors } from "@/polymet/components/beach-life-color-palette";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

const beachCardVariants = cva(
  "rounded-lg overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-100 shadow-sm hover:shadow-md",
        ocean:
          "bg-gradient-to-br from-[#0891B2]/5 to-[#22D3EE]/10 border border-[#22D3EE]/20 shadow-sm hover:shadow-md",
        sunset:
          "bg-gradient-to-br from-[#F43F5E]/5 to-[#8B5CF6]/10 border border-[#F43F5E]/20 shadow-sm hover:shadow-md",
        beach:
          "bg-gradient-to-br from-[#FBBF24]/5 to-[#F59E0B]/10 border border-[#F59E0B]/20 shadow-sm hover:shadow-md",
        tropical:
          "bg-gradient-to-br from-[#06B6D4]/5 to-[#4ADE80]/10 border border-[#4ADE80]/20 shadow-sm hover:shadow-md",
        solid: "bg-white border-2 border-[#0891B2] shadow-sm hover:shadow-md",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 transition-transform",
        glow: "hover:shadow-lg hover:shadow-[#0891B2]/10",
        highlight: "hover:border-[#0891B2]",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: "none",
    },
  }
);

export interface BeachThemeCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof beachCardVariants> {
  asChild?: boolean;
}

const BeachThemeCard = forwardRef<HTMLDivElement, BeachThemeCardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => {
    return (
      <div
        className={cn(
          beachCardVariants({ variant, padding, hover, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

BeachThemeCard.displayName = "BeachThemeCard";

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const BeachCardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5",
          withBorder && "pb-4 border-b border-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);

BeachCardHeader.displayName = "BeachCardHeader";

// Card Title Component
const BeachCardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold text-[#0891B2]", className)}
      {...props}
    />
  );
});

BeachCardTitle.displayName = "BeachCardTitle";

// Card Description Component
const BeachCardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  );
});

BeachCardDescription.displayName = "BeachCardDescription";

// Card Content Component
const BeachCardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

BeachCardContent.displayName = "BeachCardContent";

// Card Footer Component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const BeachCardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          withBorder && "pt-4 border-t border-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);

BeachCardFooter.displayName = "BeachCardFooter";

// Card Image Component
interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  aspectRatio?: "video" | "square" | "wide" | "auto";
  overlay?: boolean;
  overlayColor?: string;
  height?: string;
}

const BeachCardImage = forwardRef<HTMLDivElement, CardImageProps>(
  (
    {
      className,
      src,
      alt = "",
      aspectRatio = "video",
      overlay = false,
      overlayColor = "bg-gradient-to-t from-black/60 to-transparent",
      height,
      ...props
    },
    ref
  ) => {
    const aspectRatioClass = {
      video: "aspect-video",
      square: "aspect-square",
      wide: "aspect-[21/9]",
      auto: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          aspectRatio !== "auto" && aspectRatioClass[aspectRatio],
          height,
          className
        )}
        {...props}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />

        {overlay && (
          <div className={cn("absolute inset-0", overlayColor)}></div>
        )}
      </div>
    );
  }
);

BeachCardImage.displayName = "BeachCardImage";

// Badge Component for Cards
interface BeachCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "yoga" | "surf" | "music" | "market" | "community";
}

const BeachCardBadge = forwardRef<HTMLSpanElement, BeachCardBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const badgeStyles = {
      default: "bg-[#0891B2] text-white",
      yoga: "bg-[#8B5CF6] text-white",
      surf: "bg-[#06B6D4] text-white",
      music: "bg-[#F43F5E] text-white",
      market: "bg-[#F59E0B] text-white",
      community: "bg-[#84CC16] text-white",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          badgeStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

BeachCardBadge.displayName = "BeachCardBadge";

export {
  BeachThemeCard,
  BeachCardHeader,
  BeachCardTitle,
  BeachCardDescription,
  BeachCardContent,
  BeachCardFooter,
  BeachCardImage,
  BeachCardBadge,
  beachCardVariants,
};
