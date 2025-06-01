
import { Link } from "react-router-dom";
import { Button } from "@/components/polymet/button";
import CategoryBadge from "@/components/polymet/category-badge";
import { useEventNavigation } from "@/hooks/useEventNavigation";

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
    <span className={`inline-flex items-center rounded-full bg-purple-100 text-purple-800 font-medium ${sizeClasses[size]}`}>
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
  const { navigateToEvent } = useEventNavigation();

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Check if click originated from RSVP buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    e.preventDefault();
    
    console.log('Polymet EventCard clicked - navigating to event detail:', id);
    
    // Create a basic event object for navigation - always go to event detail
    const event = {
      id: String(id),
      title,
      image_urls: [image],
      event_category: category,
      location,
      start_date: date,
      start_time: time
    };
    navigateToEvent(event as any);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-secondary-50 bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 brightness-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={category} />
        </div>

        {/* Vibe label if provided */}
        {vibe && (
          <div className="absolute right-3 top-3">
            <EventVibeLabel vibe={vibe} size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 font-semibold text-primary line-clamp-2 font-inter">
          {title}
        </h3>

        {/* Host info */}
        {host && <p className="mb-2 text-sm text-neutral-75">By {host.name}</p>}

        {/* Date and time */}
        <div className="mb-2 flex items-center text-sm text-neutral-75">
          <span>
            {date}
            {time && ` • ${time}`}
          </span>
        </div>

        {/* Location */}
        {location && (
          <p className="mb-2 text-sm text-neutral-75 line-clamp-1">
            {location}
          </p>
        )}

        {/* Attendees */}
        {attendees && (
          <div className="mt-auto flex items-center pt-2">
            <div className="flex -space-x-2">
              {attendees.avatars?.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Attendee"
                  className="h-6 w-6 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-neutral-75">
              {attendees.count}{" "}
              {attendees.count === 1 ? "attendee" : "attendees"}
            </span>
          </div>
        )}

        {/* RSVP buttons */}
        {showRsvp && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleRsvpGoing}
            >
              Going
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleRsvpInterested}
            >
              Interested
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
