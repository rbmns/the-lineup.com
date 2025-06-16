
import { cn } from "@/lib/utils";
import { bohemianColors } from "@/components/polymet/bohemian-color-palette";

interface BohemianLogoProps {
  variant?: "light" | "dark";
  style?: "waves" | "simple";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function BohemianLogo({
  variant = "dark",
  style = "simple",
  size = "md",
  className
}: BohemianLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto", 
    lg: "h-16 w-auto"
  };

  const textColor = variant === "light" ? "text-white" : "text-[#8B4513]";

  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <span className={cn("font-serif font-bold", textColor)}>
        Bohemian Events
      </span>
    </div>
  );
}
