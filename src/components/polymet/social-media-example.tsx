import React from 'react';
import { brandColors } from '@/components/polymet/brand-colors';
import { Logo } from '@/components/polymet/logo';
import { cn } from '@/lib/utils';

// Platform-specific configurations
const platformConfig = {
  instagram: {
    aspectRatio: "aspect-[1/1]", // Square for feed posts
    dimensions: "1080x1080px",
    overlayGradient: "bg-gradient-to-t from-black/80 via-black/30 to-black/50",
  },
  facebook: {
    aspectRatio: "aspect-[1.91/1]", // Landscape for feed
    dimensions: "1200x630px",
    overlayGradient: "bg-gradient-to-tr from-black/70 via-black/40 to-black/20",
  },
  twitter: {
    aspectRatio: "aspect-[1.91/1]", // Standard Twitter card
    dimensions: "1200x675px",
    overlayGradient: "bg-gradient-to-b from-black/60 via-black/30 to-black/70",
  },
};

interface SocialMediaExampleProps {
  platform: "instagram" | "facebook" | "twitter";
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  className?: string;
}

export default function SocialMediaExample({
  platform,
  title,
  category,
  date,
  location,
  image,
  className,
}: SocialMediaExampleProps) {
  const config = platformConfig[platform];

  // Color selection based on category
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      Yoga: brandColors.vibrant.seafoam,
      Surf: brandColors.nature.ocean,
      Music: "#9D4EDD", // Purple
      Food: "#E85D04", // Orange
      Market: "#386641", // Green
      Community: "#00B4D8", // Blue
      Culture: "#F72585", // Pink
      Festival: "#9D4EDD", // Purple
    };

    return categoryMap[category] || brandColors.vibrant.teal;
  };

  const categoryColor = getCategoryColor(category);

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

        <div className="absolute inset-0 bg-black/30"></div>

        {/* Gradient overlay for better text visibility */}
        <div className={cn("absolute inset-0", config.overlayGradient)}></div>
      </div>

      {/* Content container */}
      <div className="relative h-full flex flex-col p-6">
        {/* Header with logo and category */}
        <div className="flex justify-between items-start mb-auto">
          <Logo variant="white" size="sm" />

          <span
            className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white"
            style={{ backgroundColor: `${categoryColor}80` }}
          >
            {category}
          </span>
        </div>

        {/* Main content area */}
        <div className="mt-auto">
          {/* Title */}
          <h2
            className={cn(
              "font-bold text-white mb-3",
              platform === "instagram"
                ? "text-lg md:text-xl"
                : "text-xl md:text-2xl"
            )}
          >
            {title}
          </h2>

          {/* Event details */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <CalendarIcon size={16} />

              <span>{date}</span>
            </div>

            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPinIcon size={16} />

              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Footer with CTA or app info */}
        <div className="mt-4 pt-3 border-t border-white/20 text-white/90 text-xs flex justify-between items-center">
          <span>thelineup.app</span>
          <span>#JoinTheFlow</span>
        </div>
      </div>

      {/* Platform-specific overlay elements */}
      {platform === "instagram" && (
        <div className="absolute top-0 right-0 m-2 p-1 bg-black/50 rounded text-white text-xs">
          {config.dimensions}
        </div>
      )}

      {platform === "facebook" && (
        <div className="absolute top-0 right-0 m-2 p-1 bg-black/50 rounded text-white text-xs">
          {config.dimensions}
        </div>
      )}

      {platform === "twitter" && (
        <div className="absolute top-0 right-0 m-2 p-1 bg-black/50 rounded text-white text-xs">
          {config.dimensions}
        </div>
      )}
    </div>
  );
}
