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
type ContentType = "event" | "feature" | "introduction";
type PostFormat = "square" | "portrait" | "landscape";

interface InstagramPostTemplateProps {
  type?: ContentType;
  format?: PostFormat;
  title: string;
  subtitle?: string;
  image: string;
  date?: string;
  location?: string;
  category?: string;
  attendees?: number;
  className?: string;
}

export function InstagramPostTemplate({
  type = "event",
  format = "square",
  title,
  subtitle,
  image,
  date,
  location,
  category,
  attendees,
  className,
}: InstagramPostTemplateProps) {
  // Format-specific dimensions
  const formatConfig = {
    square: {
      aspectRatio: "aspect-[1/1]", // 1:1
      textSize: "text-lg md:text-xl",
    },
    portrait: {
      aspectRatio: "aspect-[4/5]", // 4:5
      textSize: "text-lg md:text-xl",
    },
    landscape: {
      aspectRatio: "aspect-[1.91/1]", // 1.91:1
      textSize: "text-base md:text-lg",
    },
  };

  // Content type specific styling
  const contentConfig = {
    event: {
      accentColor: brandColors.vibrant.teal,
      secondaryColor: brandColors.vibrant.coral,
      badgeColor: "bg-white/20 text-white",
      gradient: "bg-gradient-to-tr from-[#005F73]/80 to-[#0A9396]/50",
    },
    feature: {
      accentColor: brandColors.vibrant.seafoam,
      secondaryColor: brandColors.vibrant.sunset,
      badgeColor: "bg-white/20 text-white",
      gradient: "bg-gradient-to-tr from-[#94D2BD]/80 to-[#E9D8A6]/50",
    },
    introduction: {
      accentColor: brandColors.vibrant.sunset,
      secondaryColor: brandColors.vibrant.coral,
      badgeColor: "bg-white/20 text-white",
      gradient: "bg-gradient-to-tr from-[#EE9B00]/80 to-[#CA6702]/50",
    },
  };

  const config = formatConfig[format];
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

        <div className="absolute inset-0 bg-black/40"></div>

        {/* Gradient overlay for better text visibility and brand style */}
        <div
          className={cn("absolute inset-0 opacity-70", contentStyle.gradient)}
        ></div>

        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
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

              {attendees && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <UsersIcon size={16} />

                  <span>{attendees} attending</span>
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

// Story template with story UI elements
export function InstagramStoryTemplate(
  props: Omit<InstagramPostTemplateProps, "format">
) {
  return (
    <div className="aspect-[9/16] w-full max-w-sm relative">
      <InstagramPostTemplate {...props} format="portrait" className="h-full" />

      {/* Story progress bar */}
      <div className="absolute top-2 left-0 right-0 px-2 flex gap-1">
        <div className="h-1 bg-white rounded-full flex-1"></div>
        <div className="h-1 bg-white/40 rounded-full flex-1"></div>
        <div className="h-1 bg-white/40 rounded-full flex-1"></div>
      </div>

      {/* Story interaction elements */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-4">
        <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Carousel template with indicators
export function InstagramCarouselTemplate(
  props: Omit<InstagramPostTemplateProps, "format">
) {
  return (
    <div className="aspect-[1/1] w-full max-w-md relative">
      <InstagramPostTemplate {...props} format="square" className="h-full" />

      {/* Carousel indicators */}
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

// Reel template with video controls
export function InstagramReelTemplate(
  props: Omit<InstagramPostTemplateProps, "format">
) {
  return (
    <div className="aspect-[9/16] w-full max-w-sm relative">
      <InstagramPostTemplate {...props} format="portrait" className="h-full" />

      {/* Reel play button */}
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

      {/* Reel interaction buttons */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1">12.4k</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <span className="text-white text-xs mt-1">843</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
          <span className="text-white text-xs mt-1">Share</span>
        </div>
      </div>

      {/* Audio indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
        <div className="animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </div>
        <span className="text-white text-xs">Original Audio</span>
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default InstagramPostTemplate;
