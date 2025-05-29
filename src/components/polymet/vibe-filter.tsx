
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { vibeOptions } from "@/components/polymet/event-vibe-label-enhanced";

interface VibeFilterProps {
  selectedVibe: string | null;
  onChange: (vibe: string | null) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function VibeFilter({
  selectedVibe,
  onChange,
  size = "md",
  className,
}: VibeFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  // Handle scroll shadows
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  // Check for shadows on mount and resize
  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  // Size classes for the filter items
  const sizeClasses = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-1.5 px-3",
    lg: "text-base py-2 px-4",
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Left shadow indicator */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
      )}

      {/* Right shadow indicator */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-1 -mx-1"
        onScroll={handleScroll}
      >
        {/* "All" option */}
        <button
          onClick={() => onChange(null)}
          className={cn(
            "flex items-center justify-center whitespace-nowrap rounded-full border transition-all duration-200",
            sizeClasses[size],
            selectedVibe === null
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
        >
          All Vibes
        </button>

        {/* Vibe options */}
        <div className="flex gap-2 px-2">
          {vibeOptions.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => onChange(vibe.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full border transition-all duration-200",
                sizeClasses[size],
                selectedVibe === vibe.id
                  ? cn(vibe.color, "opacity-100")
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 opacity-80"
              )}
            >
              {vibe.icon}
              {vibe.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
