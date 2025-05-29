
import { cn } from "@/lib/utils";
import { BeachThemeCategoryBadge } from "@/components/polymet/beach-theme-category-badge";
import { BeachThemeButton } from "@/components/polymet/beach-theme-button";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
  // Handle RSVP actions
  const handleRsvpGoing = (e: React.MouseEvent) => {
    e.preventDefault();
    onRsvpGoing?.(id);
  };

  const handleRsvpInterested = (e: React.MouseEvent) => {
    e.preventDefault();
    onRsvpInterested?.(id);
  };

  // Determine if the card is featured (horizontal layout)
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  // Generate vibe badge if provided
  const vibeBadge = vibe && (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
      {vibe}
    </span>
  );

  return (
    <Link
      to={`/events/${id}`}
      className={cn(
        "group block overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md",
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
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

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
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <h3 className="text-sm font-semibold text-white line-clamp-1">
                {title}
              </h3>
            </div>
          )}
        </div>

        {/* Content Container */}
        {!isCompact && (
          <div
            className={cn(
              "flex flex-col",
              isFeatured ? "flex-1 p-4" : "p-3",
              "bg-white"
            )}
          >
            {/* Title */}
            <h3
              className={cn(
                "font-semibold text-[#0891B2] line-clamp-2",
                isFeatured ? "text-xl mb-2" : "text-base mb-1"
              )}
            >
              {title}
            </h3>

            {/* Host Info */}
            {host && (
              <p className="text-sm text-gray-600 mb-2">
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
            <div className="mt-auto space-y-1.5">
              {/* Location */}
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon size={14} className="mr-1 text-[#F59E0B]" />

                  <span className="truncate">{location}</span>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon size={14} className="mr-1 text-[#F59E0B]" />

                <span>
                  {date}
                  {time && ` • ${time}`}
                </span>
              </div>

              {/* Attendees */}
              {attendees && (
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon size={14} className="mr-1 text-[#F59E0B]" />

                  <span>
                    {attendees.count} {attendees.max && `/ ${attendees.max}`}{" "}
                    attending
                  </span>
                </div>
              )}

              {/* RSVP Buttons */}
              {showRsvp && (
                <div className="flex gap-2 mt-3">
                  <BeachThemeButton
                    variant="ocean"
                    size="sm"
                    rounded="full"
                    onClick={handleRsvpGoing}
                    className="flex-1"
                  >
                    Going
                  </BeachThemeButton>
                  <BeachThemeButton
                    variant="outline"
                    size="sm"
                    rounded="full"
                    onClick={handleRsvpInterested}
                    className="flex-1 border-[#0891B2] text-[#0891B2]"
                  >
                    Interested
                  </BeachThemeButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
