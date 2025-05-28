import { cn } from "@/lib/utils";
import { brandColors } from "@/polymet/components/brand-colors";
import {
  TypographyH3,
  TypographyP,
  TypographyAccent,
  TypographyTagline,
} from "@/polymet/components/brand-typography";
import BrandLogo from "@/polymet/components/brand-logo";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

// Template types
type SocialPlatform = "instagram" | "facebook" | "twitter";
type ContentType = "event" | "feature" | "introduction";

interface SocialMediaTemplateProps {
  platform: SocialPlatform;
  type?: ContentType;
  title: string;
  subtitle?: string;
  image: string;
  date?: string;
  location?: string;
  category?: string;
  className?: string;
}

export function SocialMediaTemplate({
  platform,
  type = "event",
  title,
  subtitle,
  image,
  date,
  location,
  category,
  className,
}: SocialMediaTemplateProps) {
  // Platform-specific dimensions and styling
  const platformConfig = {
    instagram: {
      aspectRatio: "aspect-[1/1]", // Square for feed posts
      storyAspect: "aspect-[9/16]", // For stories
      reelAspect: "aspect-[9/16]", // For reels
      textSize: "text-lg md:text-xl",
      overlayOpacity: "bg-black/40",
    },
    facebook: {
      aspectRatio: "aspect-[16/9]", // Landscape for feed
      textSize: "text-lg md:text-2xl",
      overlayOpacity: "bg-black/30",
    },
    twitter: {
      aspectRatio: "aspect-[16/9]", // Standard Twitter card
      textSize: "text-base md:text-xl",
      overlayOpacity: "bg-black/35",
    },
  };

  // Content type specific styling
  const contentConfig = {
    event: {
      accentColor: brandColors.vibrant.teal,
      secondaryColor: brandColors.vibrant.coral,
      badgeColor: "bg-white/20 text-white",
    },
    feature: {
      accentColor: brandColors.vibrant.seafoam,
      secondaryColor: brandColors.vibrant.sunset,
      badgeColor: "bg-white/20 text-white",
    },
    introduction: {
      accentColor: brandColors.vibrant.sunset,
      secondaryColor: brandColors.vibrant.coral,
      badgeColor: "bg-white/20 text-white",
    },
  };

  const config = platformConfig[platform];
  const contentStyle = contentConfig[type];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg shadow-lg",
        config.aspectRatio,
        className
      )}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        <div className={cn("absolute inset-0", config.overlayOpacity)}></div>

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Content container */}
      <div className="relative h-full flex flex-col p-6">
        {/* Header with logo and category */}
        <div className="flex justify-between items-start mb-auto">
          <BrandLogo variant="white" size="sm" />

          {category && (
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                contentStyle.badgeColor
              )}
              style={{ backgroundColor: `${contentStyle.accentColor}80` }}
            >
              {category}
            </span>
          )}
        </div>

        {/* Main content area */}
        <div className="mt-auto">
          {/* Tagline */}
          <div
            className="mb-2 text-sm uppercase tracking-wider font-medium"
            style={{ color: contentStyle.secondaryColor }}
          >
            {type === "event"
              ? "Join us"
              : type === "feature"
                ? "New feature"
                : "Introducing"}
          </div>

          {/* Title */}
          <h2 className={cn("font-bold text-white mb-3", config.textSize)}>
            {title}
          </h2>

          {/* Subtitle or description */}
          {subtitle && (
            <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2">
              {subtitle}
            </p>
          )}

          {/* Event details for event type */}
          {type === "event" && (
            <div className="flex flex-col gap-2 mt-4">
              {date && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CalendarIcon size={16} />

                  <span>{date}</span>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPinIcon size={16} />

                  <span>{location}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with CTA or app info */}
        <div className="mt-4 pt-3 border-t border-white/20 text-white/90 text-xs flex justify-between items-center">
          <span>thelineup.app</span>
          <span>
            {type === "event"
              ? "#JoinTheFlow"
              : type === "feature"
                ? "#StayInTheLoop"
                : "#DiscoverMore"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Story template with different aspect ratio
export function SocialMediaStoryTemplate(
  props: Omit<SocialMediaTemplateProps, "platform">
) {
  return (
    <div className="aspect-[9/16] w-full max-w-sm">
      <SocialMediaTemplate {...props} platform="instagram" className="h-full" />
    </div>
  );
}

// Reel template with video placeholder
export function SocialMediaReelTemplate(
  props: Omit<SocialMediaTemplateProps, "platform">
) {
  return (
    <div className="aspect-[9/16] w-full max-w-sm relative">
      <SocialMediaTemplate {...props} platform="instagram" className="h-full" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Carousel template with multiple slides indicator
export function SocialMediaCarouselTemplate(
  props: Omit<SocialMediaTemplateProps, "platform">
) {
  return (
    <div className="aspect-[1/1] w-full max-w-md relative">
      <SocialMediaTemplate {...props} platform="instagram" className="h-full" />

      <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
        1/3
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
        <div className="w-6 h-1 bg-white rounded-full"></div>
        <div className="w-6 h-1 bg-white/40 rounded-full"></div>
        <div className="w-6 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default SocialMediaTemplate;
