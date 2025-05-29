import { cn } from "@/lib/utils";

interface WaveIconProps {
  className?: string;
  variant?: "default" | "circle" | "minimal";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function WaveIcon({
  className,
  variant = "default",
  size = "md",
}: WaveIconProps) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-nature-ocean",
          sizeClasses[size],
          className
        )}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          <path
            d="M30 65C40 45 60 65 70 45"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], className)}
      >
        <path
          d="M30 65C40 45 60 65 70 45"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
    >
      <circle cx="50" cy="50" r="50" fill="#005F73" />

      <path
        d="M20 65C30 35 50 65 60 35C70 5 80 35 90 20"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M10 50C20 30 40 50 50 30C60 10 70 30 80 15"
        stroke="#EE6C4D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M30 80C40 60 60 80 70 60"
        stroke="#E9C46A"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
