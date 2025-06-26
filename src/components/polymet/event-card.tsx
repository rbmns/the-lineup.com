
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryBadge from "@/components/polymet/category-badge";
import { LineupImage } from "@/components/ui/lineup-image";
import { DEFAULT_FALLBACK_IMAGE_URL } from "@/utils/eventImages";
import { CalendarIcon, MapPinIcon } from "lucide-react";

interface EventVibeLabel {
  vibe: string;
  size?: "sm" | "md" | "lg";
}

// Simple EventVibeLabel component
function EventVibeLabel({ vibe, size = "md" }: EventVibeLabel) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5", 
    lg: "text-sm px-3 py-1",
  };

  return (
    <span className={`inline-flex items-center rounded-full bg-seafoam text-midnight font-medium ${sizeClasses[size]}`}>
      {vibe}
    </span>
  );
}

interface EventCardProps {
  id: string | number;
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
    avatars?: string[];
  };
  showRsvp?: boolean;
  onRsvpGoing?: (id: string | number) => void;
  onRsvpInterested?: (id: string | number) => void;
  href?: string;
  className?: string;
}

export default function EventCard({
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
  href,
  className,
}: EventCardProps) {
  const handleRsvpGoing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRsvpGoing) onRsvpGoing(id);
  };

  const handleRsvpInterested = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRsvpInterested) onRsvpInterested(id);
  };

  const eventUrl = href || `/events/${id}`;

  return (
    <Link
      to={eventUrl}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-overcast bg-coconut shadow-md transition-shadow hover:shadow-lg font-inter ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <LineupImage
          src={image}
          alt={title}
          aspectRatio="video"
          treatment="subtle-overlay"
          overlayVariant="ocean"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== DEFAULT_FALLBACK_IMAGE_URL) {
              target.src = DEFAULT_FALLBACK_IMAGE_URL;
            }
          }}
        />

        {/* Category badge */}
        <div className="absolute left-3 top-3 z-20">
          <CategoryBadge category={category} />
        </div>

        {/* Vibe label if provided */}
        {vibe && (
          <div className="absolute right-3 top-3 z-20">
            <EventVibeLabel vibe={vibe} size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 items-start text-left font-inter">
        <h3 className="mb-1 font-display text-midnight line-clamp-2 font-inter text-left w-full">
          {title}
        </h3>

        {/* Host info */}
        {host && <p className="mb-2 font-mono text-overcast text-xs font-inter text-left w-full">By {host.name}</p>}

        <div className="flex flex-col gap-1.5 mt-1 w-full">
          {/* Date and time */}
          <div className="flex items-center font-mono text-overcast text-xs font-inter text-left">
            <CalendarIcon size={16} className="mr-2 flex-shrink-0 text-clay" />
            <span>
              {date}
              {time && ` • ${time}`}
            </span>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center font-mono text-overcast text-xs font-inter text-left">
              <MapPinIcon size={16} className="mr-2 flex-shrink-0 text-clay" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>

        {/* Attendees */}
        {attendees && (
          <div className="mt-auto flex items-center pt-2 text-left w-full">
            <div className="flex -space-x-2">
              {attendees.avatars?.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Attendee"
                  className="h-6 w-6 rounded-full border-2 border-coconut object-cover"
                />
              ))}
            </div>
            <span className="ml-2 font-mono text-overcast text-xs font-inter">
              {attendees.count}{" "}
              {attendees.count === 1 ? "attendee" : "attendees"}
            </span>
          </div>
        )}

        {/* RSVP buttons */}
        {showRsvp && (
          <div className="mt-4 flex gap-2 w-full">
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-clay text-midnight text-sm hover:bg-seafoam font-inter"
              onClick={handleRsvpGoing}
            >
              Going
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-overcast text-midnight hover:bg-sage font-inter"
              onClick={handleRsvpInterested}
            >
              Interested
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}
