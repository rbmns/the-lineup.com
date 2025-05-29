import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white" | "black";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  asLink?: boolean;
}

export default function Logo({
  variant = "default",
  size = "md",
  showIcon = true,
  showText = true,
  className,
  asLink = true,
}: LogoProps) {
  // Size mappings
  const sizeClasses = {
    xs: "h-6",
    sm: "h-7",
    md: "h-8",
    lg: "h-10",
    xl: "h-12",
  };

  // Color mappings based on variant
  const colorClasses = {
    default: "text-primary dark:text-white",
    white: "text-white",
    black: "text-black",
  };

  // Accent color for "the" prefix
  const accentColorClasses = {
    default: "text-vibrant-sunset",
    white: "text-vibrant-sand",
    black: "text-vibrant-sunset",
  };

  const logoContent = (
    <div
      className={cn(
        "flex items-center transition-colors",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <div className="mr-2 relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-full w-auto", colorClasses[variant])}
          >
            <circle
              cx="12"
              cy="12"
              r="11"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M6 14C8 11.5 10 13 12 15.5C14 18 16 16.5 18 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M6 10C8 7.5 10 9 12 11.5C14 14 16 12.5 18 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {showText && (
        <div className="flex items-baseline font-inter font-bold tracking-tight">
          <span className={cn("text-sm", accentColorClasses[variant])}>
            the
          </span>
          <span className={cn("text-lg", colorClasses[variant])}>lineup.</span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return <Link to="/">{logoContent}</Link>;
  }

  return logoContent;
}
