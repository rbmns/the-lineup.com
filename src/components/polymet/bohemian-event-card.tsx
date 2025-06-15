
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { BohemianButton } from "@/components/polymet/bohemian-button";
import { categoryBadgeVariants } from "@/components/polymet/bohemian-color-palette";

interface BohemianEventCardProps {
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
  variant?: "default" | "featured" | "compact" | "horizontal";
  showRsvp?: boolean;
  onRsvpGoing?: (id: string) => void;
  onRsvpInterested?: (id: string) => void;
  className?: string;
}

export default function BohemianEventCard({
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
  variant = "default",
  showRsvp = false,
  onRsvpGoing,
  onRsvpInterested,
  className,
}: BohemianEventCardProps) {
  // Map category to appropriate variant
  const getCategoryVariant = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (
      [
        "yoga",
        "surf",
        "music",
        "market",
        "community",
        "food",
        "culture",
        "festival",
        "sport",
        "art",
        "wellness",
      ].includes(lowerCategory)
    ) {
      return lowerCategory as any;
    }
    return "default";
  };

  const handleRsvpGoing = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRsvpGoing) onRsvpGoing(id);
  };

  const handleRsvpInterested = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRsvpInterested) onRsvpInterested(id);
  };

  if (variant === "compact") {
    return (
      <Link
        to={`/events/${id}`}
        className={cn(
          "group block rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg font-inter",
          className
        )}
      >
        <div className="relative h-40 w-full">
          <img src={image} alt={title} className="h-full w-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 p-3 font-inter text-left">
            <span
              className={categoryBadgeVariants({
                category: getCategoryVariant(category),
                size: "sm",
              })}
            >
              {category}
            </span>
            <h3 className="mt-1 text-sm font-medium text-white line-clamp-2 font-inter text-left">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured" || variant === "horizontal") {
    return (
      <Link
        to={`/events/${id}`}
        className={cn(
          "group block rounded-xl overflow-hidden border border-secondary-medium bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg font-inter",
          className
        )}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-2/5 h-48 md:h-auto">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />

            <div className="absolute top-3 left-3">
              <span
                className={categoryBadgeVariants({
                  category: getCategoryVariant(category),
                })}
              >
                {category}
              </span>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-6 font-inter text-left">
            <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-accent-teal transition-colors font-inter text-left w-full">
              {title}
            </h3>

            <div className="space-y-2 mb-4 w-full">
              <div className="flex items-start text-primary-light font-inter text-left">
                <CalendarIcon size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm flex flex-col sm:flex-row sm:items-baseline sm:gap-x-1">
                    <span>{date}</span>
                    {time && (
                      <>
                        <span className="hidden sm:inline mx-1">•</span>
                        <span>{time}</span>
                      </>
                    )}
                </div>
              </div>

              {location && (
                <div className="flex items-center text-primary-light font-inter text-left w-full">
                  <MapPinIcon size={16} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">{location}</span>
                </div>
              )}

              {attendees && (
                <div className="flex items-center text-primary-light font-inter text-left w-full">
                  <UserIcon size={16} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    {attendees.count}{" "}
                    {attendees.max ? `/ ${attendees.max}` : ""} attending
                  </span>
                </div>
              )}
            </div>

            {showRsvp && (
              <div className="flex gap-2 mt-4 w-full">
                <BohemianButton
                  variant="teal"
                  size="sm"
                  rounded="full"
                  onClick={handleRsvpGoing}
                  className="font-inter"
                >
                  Going
                </BohemianButton>
                <BohemianButton
                  variant="outline"
                  size="sm"
                  rounded="full"
                  onClick={handleRsvpInterested}
                  className="font-inter"
                >
                  Interested
                </BohemianButton>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      to={`/events/${id}`}
      className={cn(
        "group block rounded-xl overflow-hidden border border-secondary-medium bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg font-inter",
        className
      )}
    >
      <div className="relative h-48">
        <img src={image} alt={title} className="h-full w-full object-cover" />

        <div className="absolute top-3 left-3">
          <span
            className={categoryBadgeVariants({
              category: getCategoryVariant(category),
            })}
          >
            {category}
          </span>
        </div>
      </div>
      <div className="p-4 font-inter text-left">
        <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent-teal transition-colors font-inter text-left w-full">
          {title}
        </h3>

        <div className="space-y-2 mb-3 w-full">
          <div className="flex items-start text-primary-light font-inter text-left">
            <CalendarIcon size={16} className="mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm flex flex-col sm:flex-row sm:items-baseline sm:gap-x-1">
              <span>{date}</span>
              {time && (
                <>
                  <span className="hidden sm:inline mx-1">•</span>
                  <span>{time}</span>
                </>
              )}
            </div>
          </div>
          {location && (
            <div className="flex items-center text-primary-light font-inter text-left w-full">
              <MapPinIcon size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>
        {host && (
          <div className="flex items-center mt-3 font-inter text-left w-full">
            {host.avatar ? (
              <img
                src={host.avatar}
                alt={host.name}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-earth-sand flex items-center justify-center mr-2">
                <span className="text-xs text-primary font-medium">
                  {host.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-primary-medium">{host.name}</span>
          </div>
        )}
        {showRsvp && (
          <div className="flex gap-2 mt-4 w-full">
            <BohemianButton
              variant="teal"
              size="sm"
              rounded="full"
              onClick={handleRsvpGoing}
              className="font-inter"
            >
              Going
            </BohemianButton>
            <BohemianButton
              variant="outline"
              size="sm"
              rounded="full"
              onClick={handleRsvpInterested}
              className="font-inter"
            >
              Interested
            </BohemianButton>
          </div>
        )}
      </div>
    </Link>
  );
}
