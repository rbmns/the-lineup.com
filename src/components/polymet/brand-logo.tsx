import { cn } from "@/lib/utils";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "default" | "white" | "black";
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function BrandLogo({
  variant = "default",
  size = "md",
  showIcon = true,
  showText = true,
  className,
  href,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
    xl: "h-14",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const variantClasses = {
    default: "text-primary fill-primary",
    white: "text-white fill-white",
    black: "text-black fill-black",
  };

  const Logo = () => (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className={cn("relative", sizeClasses[size])}>
          <svg
            viewBox="0 0 40 40"
            className={cn("h-full w-auto", variantClasses[variant])}
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="20"
              cy="20"
              r="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M10 22C13 19 17 19 20 22C23 25 27 25 30 22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            <path
              d="M10 16C13 13 17 13 20 16C23 19 27 19 30 16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            <path
              d="M10 28C13 25 17 25 20 28C23 31 27 31 30 28"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      {showText && (
        <span
          className={cn(
            "font-inter font-medium tracking-tight",
            textSizeClasses[size],
            variantClasses[variant]
          )}
        >
          the lineup.
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="inline-flex">
        <Logo />
      </Link>
    );
  }

  return <Logo />;
}
