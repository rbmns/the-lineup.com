import { cn } from "@/lib/utils";
import { BohemianButton } from "@/polymet/components/bohemian-button";
import { MapPinIcon } from "lucide-react";
import { bohemianColors } from "@/polymet/components/bohemian-color-palette";
import BohemianLogo from "@/polymet/components/bohemian-logo";

interface BohemianHeroSectionProps {
  title?: string;
  location?: string;
  subtitle?: string;
  backgroundImage?: string;
  variant?: "default" | "terracotta" | "teal" | "indigo" | "ochre";
  pattern?: "none" | "dots" | "lines" | "weave";
  size?: "small" | "default" | "large";
  onExplore?: () => void;
  onCreateProfile?: () => void;
  className?: string;
}

export default function BohemianHeroSection({
  title = "See what's on in",
  location = "Zandvoort",
  subtitle = "Discover local events and casual plans that fit your vibe. Explore what's happening nearby — music, surf, art, community, and more.",
  backgroundImage = "https://picsum.photos/seed/bohemianhero/1920/1080",
  variant = "default",
  pattern = "none",
  size = "default",
  onExplore,
  onCreateProfile,
  className,
}: BohemianHeroSectionProps) {
  // Determine overlay color based on variant
  const getOverlayColor = () => {
    switch (variant) {
      case "terracotta":
        return bohemianColors.overlays.terracotta;
      case "teal":
        return bohemianColors.overlays.teal;
      case "indigo":
        return bohemianColors.overlays.indigo;
      case "ochre":
        return "bg-[#C89F5D]/40";
      default:
        return bohemianColors.overlays.dark;
    }
  };

  // Determine pattern based on selected pattern
  const getPattern = () => {
    switch (pattern) {
      case "dots":
        return bohemianColors.patterns.dots;
      case "lines":
        return bohemianColors.patterns.lines;
      case "weave":
        return bohemianColors.patterns.weave;
      default:
        return "";
    }
  };

  // Determine height based on size
  const getHeight = () => {
    switch (size) {
      case "small":
        return "min-h-[300px] md:min-h-[350px]";
      case "large":
        return "min-h-[500px] md:min-h-[600px]";
      default:
        return "min-h-[400px] md:min-h-[500px]";
    }
  };

  // Determine button variant based on hero variant
  const getPrimaryButtonVariant = () => {
    switch (variant) {
      case "terracotta":
        return "terracotta";
      case "teal":
        return "teal";
      case "indigo":
        return "indigo";
      case "ochre":
        return "ochre";
      default:
        return "default";
    }
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden", getHeight(), className)}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className={cn("absolute inset-0 z-10", getOverlayColor())}></div>

      {/* Pattern overlay */}
      {pattern !== "none" && (
        <div
          className={cn("absolute inset-0 z-20 opacity-20", getPattern())}
        ></div>
      )}

      {/* Wave shape at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] md:h-[80px]"
          fill="#F2F0EB"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-40 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          {size === "large" && (
            <div className="mb-6">
              <BohemianLogo variant="light" style="waves" size="lg" />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-secondary mb-2 md:mb-4">
            {title}{" "}
            {location && (
              <span className="relative inline-block">
                <span className="relative z-10">{location}</span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-earth-terracotta/30 -z-10 rounded"></span>
              </span>
            )}
          </h1>

          {location && (
            <div className="flex items-center mb-4 md:mb-6 text-secondary/90">
              <MapPinIcon size={18} className="mr-2" />

              <span>{location}</span>
            </div>
          )}

          <p className="text-lg md:text-xl text-secondary/90 mb-8 max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            {onExplore && (
              <BohemianButton
                variant={getPrimaryButtonVariant()}
                size={size === "large" ? "lg" : "default"}
                rounded="full"
                onClick={onExplore}
              >
                Explore Events
              </BohemianButton>
            )}

            {onCreateProfile && (
              <BohemianButton
                variant="outline"
                size={size === "large" ? "lg" : "default"}
                rounded="full"
                className="bg-transparent border-secondary text-secondary hover:bg-secondary/10"
                onClick={onCreateProfile}
              >
                Create Profile
              </BohemianButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
