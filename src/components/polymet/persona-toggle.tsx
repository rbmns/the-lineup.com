import { cn } from "@/lib/utils";
import { MapPinIcon, GlobeIcon } from "lucide-react";

interface PersonaToggleProps {
  activePersona: "explorer" | "local";
  onChange: (persona: "explorer" | "local") => void;
  className?: string;
}

export default function PersonaToggle({
  activePersona,
  onChange,
  className,
}: PersonaToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full bg-white/20 p-1 backdrop-blur-sm",
        className
      )}
    >
      <button
        className={cn(
          "flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
          activePersona === "explorer"
            ? "bg-white text-primary"
            : "text-white hover:bg-white/10"
        )}
        onClick={() => onChange("explorer")}
      >
        <GlobeIcon size={16} className="mr-2" />
        Explorer
      </button>
      <button
        className={cn(
          "flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
          activePersona === "local"
            ? "bg-white text-primary"
            : "text-white hover:bg-white/10"
        )}
        onClick={() => onChange("local")}
      >
        <MapPinIcon size={16} className="mr-2" />
        Local
      </button>
    </div>
  );
}
