import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { beachLifeColors } from "@/components/polymet/beach-life-color-palette";
import { SearchIcon, MapPinIcon } from "lucide-react";

interface BeachThemeHeroSectionProps {
  title?: string;
  location?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundPattern?: "waves" | "dots" | "palms" | "none";
  onExplore?: () => void;
  onCreateProfile?: () => void;
  className?: string;
  size?: "default" | "large" | "small";
  variant?: "default" | "ocean" | "sunset" | "tropical";
}

export default function BeachThemeHeroSection({
  title = "See what's on in",
  location = "Zandvoort",
  subtitle = "Discover local events and casual plans that fit your vibe. Explore what's happening nearby — music, surf, art, community, and more.",
  backgroundImage = "https://picsum.photos/seed/beachhero/1920/1080",
  backgroundPattern = "waves",
  onExplore,
  onCreateProfile,
  className,
  size = "default",
  variant = "default",
}: BeachThemeHeroSectionProps) {
  // Background gradient based on variant
  const gradientOverlay = {
    default: "bg-gradient-to-r from-[#0891B2]/90 to-[#22D3EE]/80",
    ocean: "bg-gradient-to-r from-[#0891B2]/90 to-[#22D3EE]/80",
    sunset: "bg-gradient-to-r from-[#F43F5E]/80 to-[#8B5CF6]/80",
    tropical: "bg-gradient-to-r from-[#06B6D4]/80 to-[#4ADE80]/80",
  };

  // Background pattern based on selection
  const patternClass = {
    waves: beachLifeColors.patterns.waves,
    dots: beachLifeColors.patterns.dots,
    palms: beachLifeColors.patterns.palms,
    none: "",
  };

  // Height based on size
  const heightClass = {
    small: "min-h-[300px] md:min-h-[400px]",
    default: "min-h-[400px] md:min-h-[500px]",
    large: "min-h-[500px] md:min-h-[600px]",
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        heightClass[size],
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Beach background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className={cn("absolute inset-0 z-10", gradientOverlay[variant])}
      ></div>

      {/* Pattern Overlay */}
      {backgroundPattern !== "none" && (
        <div
          className={cn(
            "absolute inset-0 z-20 opacity-20",
            patternClass[backgroundPattern]
          )}
        ></div>
      )}

      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {title}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{location}</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#F59E0B]/30 -z-0 rounded"></span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mt-4 mb-8 max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onExplore}
              className="flex items-center gap-2 rounded-full"
            >
              <SearchIcon size={18} />
              Explore Events
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onCreateProfile}
              className="bg-white/20 border-white text-white hover:bg-white/30 rounded-full"
            >
              Create Profile
            </Button>
          </div>

          {/* Location Indicator */}
          <div className="mt-8 flex items-center gap-2 text-white/90">
            <MapPinIcon size={18} className="text-[#F59E0B]" />
            <span>Events near {location}</span>
          </div>
        </div>
      </div>

      {/* Wave Decoration at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-16 md:h-24">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
