import { cn } from "@/lib/utils";
import {
  MusicIcon,
  SunIcon,
  UsersIcon,
  ShapesIcon,
  WavesIcon,
  UtensilsIcon,
  ShoppingBagIcon,
  CalendarIcon,
  HeartIcon,
  GlobeIcon,
  PaintbrushIcon,
  UserIcon,
  ZapIcon,
  MountainIcon,
  BookIcon,
} from "lucide-react";

// Define vibe options with enhanced visual distinction through colors, patterns, and minimal icon usage
export const vibeOptions = [
  {
    id: "chill",
    label: "Chill",
    icon: <SunIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#FF9E00] to-[#FFCA80] text-[#7B3F00] border-[#FF9E00]/30",
    pattern:
      "bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_50%)]",
  },
  {
    id: "social",
    label: "Social",
    icon: <UsersIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] text-[#03045E] border-[#00B4D8]/30",
    pattern:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15)_0%,transparent_70%)]",
  },
  {
    id: "active",
    label: "Active",
    icon: <ZapIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#F43F5E] to-[#FB7185] text-white border-[#F43F5E]/30",
    pattern:
      "bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_0%,transparent_50%)]",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    icon: <MountainIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#10B981] to-[#6EE7B7] text-[#064E3B] border-[#10B981]/30",
    pattern:
      "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15)_0%,transparent_70%)]",
  },
  {
    id: "wellness",
    label: "Wellness",
    icon: <ShapesIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] text-white border-[#8B5CF6]/30",
    pattern:
      "bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_40%)]",
  },
  {
    id: "cultural",
    label: "Cultural",
    icon: <GlobeIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#EC4899] to-[#F9A8D4] text-white border-[#EC4899]/30",
    pattern:
      "bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.15)_0%,transparent_80%)]",
  },
  {
    id: "creative",
    label: "Creative",
    icon: <PaintbrushIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#6366F1] to-[#A5B4FC] text-white border-[#6366F1]/30",
    pattern:
      "bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)]",
  },
  {
    id: "family",
    label: "Family",
    icon: <UserIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#0EA5E9] to-[#7DD3FC] text-[#0C4A6E] border-[#0EA5E9]/30",
    pattern:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1)_0%,transparent_60%)]",
  },
  // Keep some of the original vibes for backward compatibility
  {
    id: "music",
    label: "Music",
    icon: <MusicIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#5D3FD3] to-[#9D4EDD] text-white border-[#5D3FD3]/30",
    pattern:
      "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]",
  },
  {
    id: "surf",
    label: "Surf",
    icon: <WavesIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#005F73] to-[#0A9396] text-white border-[#005F73]/30",
    pattern:
      "bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.15)_0%,transparent_80%)]",
  },
  {
    id: "food",
    label: "Food",
    icon: <UtensilsIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#D00000] to-[#E85D04] text-white border-[#D00000]/30",
    pattern:
      "bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_40%)]",
  },
  {
    id: "market",
    label: "Market",
    icon: <ShoppingBagIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#386641] to-[#6A994E] text-white border-[#386641]/30",
    pattern:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1)_0%,transparent_60%)]",
  },
  {
    id: "festival",
    label: "Festival",
    icon: <CalendarIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#9D4EDD] to-[#C77DFF] text-white border-[#9D4EDD]/30",
    pattern:
      "bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_0%,transparent_50%)]",
  },
  {
    id: "culture",
    label: "Culture",
    icon: <BookIcon size={16} />,

    color:
      "bg-gradient-to-r from-[#F72585] to-[#FF8FAB] text-white border-[#F72585]/30",
    pattern:
      "bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)]",
  },
];

interface EventVibeLabelEnhancedProps {
  vibe: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  showPattern?: boolean;
}

export default function EventVibeLabelEnhanced({
  vibe,
  size = "md",
  className,
  showIcon = true,
  showPattern = true,
}: EventVibeLabelEnhancedProps) {
  // Find the vibe option that matches the provided vibe
  const vibeOption = vibeOptions.find(
    (option) => option.id.toLowerCase() === vibe.toLowerCase()
  );

  if (!vibeOption) {
    return null;
  }

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 rounded-md",
    md: "text-sm px-2.5 py-1 rounded-md",
    lg: "text-base px-3 py-1.5 rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-medium relative overflow-hidden",
        vibeOption.color,
        sizeClasses[size],
        className
      )}
    >
      {showPattern && (
        <span
          className={cn("absolute inset-0 opacity-70", vibeOption.pattern)}
        ></span>
      )}
      <span className="relative flex items-center gap-1.5">
        {showIcon && vibeOption.icon}
        {vibeOption.label}
      </span>
    </span>
  );
}
