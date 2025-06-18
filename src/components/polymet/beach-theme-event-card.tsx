
import { cn } from "@/lib/utils";
import { BeachThemeCategoryBadge } from "@/components/polymet/beach-theme-category-badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { LineupImage } from "@/components/ui/lineup-image";

export interface BeachThemeEventCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  vibe?: string;
  host?: {
    id?: string;
    name: string;
    avatar?: string;
  };
  location?: string;
  date: string;
  time?: string;
  attendees?: {
    count: number;
    max?: number;
    avatars?: string[];
  };
  showRsvp?: boolean;
  onRsvpGoing?: (id: string) => void;
  onRsvpInterested?: (id: string) => void;
  className?: string;
  variant?: "default" | "featured" | "compact";
}

export default function BeachThemeEventCard({
  id,
  title,
  image,
  category,
  vibe,
  host,
  location,
  date,
  time,
  attendees,
  showRsvp = false,
  onRsvpGoing,
  onRsvpInterested,
  className,
  variant = "default",
}: BeachThemeEventCardProps) {
  const handleRsvpGoing = (e: React.MouseEvent) => {
    e.preventDefault();
    onRsvpGoing?.(id);
  };

  const handleRsvpInterested = (e: React.MouseEvent) => {
    e.preventDefault();
    onRsvpInterested?.(id);
  };

  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  const vibeBadge = vibe && (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white font-inter">
      {vibe}
    </span>
  );

  return (
    <Link
      to={`/events/${id}`}
      className={cn(
        "group block overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-inter",
        isFeatured ? "bg-white" : "",
        className
      )}
    >
      <div
        className={cn(
          "flex",
          isFeatured ? "flex-row" : "flex-col",
          isCompact ? "h-full" : ""
        )}
      >
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden",
            isFeatured ? "w-2/5" : "w-full",
            isCompact ? "h-24" : isFeatured ? "h-full" : "h-48"
          )}
        >
          <LineupImage
            src={image}
            alt={title}
            aspectRatio={isCompact ? "square" : "video"}
            treatment="warm-filter"
            overlayVariant="sunset"
            className="h-full w-full group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category Badge - Top Left */}
          <div className="absolute top-2 left-2 z-10">
            <BeachThemeCategoryBadge
              category={category}
              size="sm"
              gradient="vibrant"
            />
          </div>
          {/* Vibe Badge - Top Right (if provided) */}
          {vibe && (
            <div className="absolute top-2 right-2 z-10">{vibeBadge}</div>
          )}
          {/* Title on image for compact variant */}
          {isCompact && (
            <div className="absolute bottom-2 left-2 right-2 z-10 font-inter text-left">
              <h3 className="text-sm font-semibold text-white line-clamp-1 font-inter text-left">{title}</h3>
            </div>
          )}
        </div>
        {/* Content Container */}
        {!isCompact && (
          <div
            className={cn(
              "flex flex-col items-start text-left font-inter",
              isFeatured ? "flex-1 p-4" : "p-3",
              "bg-white"
            )}
          >
            {/* Title */}
            <h3
              className={cn(
                "font-semibold text-black line-clamp-2 font-inter text-left w-full",
                isFeatured ? "text-xl mb-2" : "text-base mb-1"
              )}
            >
              {title}
            </h3>

            {/* Host Info */}
            {host && (
              <p className="text-sm text-gray-600 mb-2 font-inter text-left w-full">
                by{" "}
                <span className="font-medium">
                  {host.id ? (
                    <Link
                      to={`/profile/${host.id}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {host.name}
                    </Link>
                  ) : (
                    host.name
                  )}
                </span>
              </p>
            )}

            {/* Event Details */}
            <div className="space-y-1.5 w-full">
              {/* Date & Time */}
              <div className="flex items-center text-sm text-gray-600 font-inter text-left w-full">
                <CalendarIcon size={14} className="mr-1 text-black" />
                <span>
                  {date}
                  {time && ` • ${time}`}
                </span>
              </div>
              {/* Location */}
              {location && (
                <div className="flex items-center text-sm text-gray-600 font-inter text-left w-full">
                  <MapPinIcon size={14} className="mr-1 text-black" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              {/* Attendees */}
              {attendees && (
                <div className="flex items-center text-sm text-gray-600 font-inter text-left w-full">
                  <UserIcon size={14} className="mr-1 text-black" />
                  <span>
                    {attendees.count} {attendees.max && `/ ${attendees.max}`}{" "}
                    attending
                  </span>
                </div>
              )}
              {/* RSVP Buttons */}
              {showRsvp && (
                <div className="flex gap-2 mt-3 w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full flex-1 font-inter"
                    onClick={handleRsvpGoing}
                  >
                    Going
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-1 border-black text-black font-inter"
                    onClick={handleRsvpInterested}
                  >
                    Interested
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
