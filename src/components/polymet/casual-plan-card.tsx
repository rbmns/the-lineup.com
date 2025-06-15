
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  HeartIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryBadge from "@/components/polymet/category-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface CasualPlanCardProps {
  id: string | number;
  title: string;
  category: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
  location: string;
  date: string;
  time: string;
  attendees?: {
    count: number;
    max?: number;
    avatars?: string[];
  };
  className?: string;
  href?: string;
  showRsvp?: boolean;
}

export default function CasualPlanCard({
  id,
  title,
  category,
  host,
  location,
  date,
  time,
  attendees,
  className,
  href = `/plans/${id}`,
  showRsvp = false,
}: CasualPlanCardProps) {
  const [rsvpStatus, setRsvpStatus] = useState<"going" | "interested" | null>(
    null
  );

  const handleRSVP = (e: React.MouseEvent, status: "going" | "interested") => {
    e.preventDefault();
    e.stopPropagation();
    setRsvpStatus(status === rsvpStatus ? null : status);
    // In a real app, we would make an API call here
  };

  const isAtCapacity = attendees?.max && attendees.count >= attendees.max;

  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-secondary-50 bg-white shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <CategoryBadge category={category} />

          {attendees && (
            <div className="flex items-center text-sm text-primary-75">
              <UsersIcon size={14} className="mr-1" />

              <span>
                {attendees.count}
                {attendees.max && `/${attendees.max}`}
              </span>
            </div>
          )}
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-tight text-primary">
          {title}
        </h3>

        <div className="mb-4 flex items-center">
          <Avatar className="h-8 w-8 border border-secondary-50">
            {host.avatar ? (
              <AvatarImage src={host.avatar} alt={host.name} />
            ) : (
              <AvatarFallback>
                {host.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium">{host.name}</p>
            <p className="text-xs text-primary-75">Organizer</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-primary-75">
            <CalendarIcon size={14} strokeWidth={2} />

            <span className="truncate">{date}</span>
          </div>

          <div className="flex items-center gap-2 text-primary-75">
            <ClockIcon size={14} strokeWidth={2} />

            <span className="truncate">{time}</span>
          </div>

          <div className="flex items-center gap-2 text-primary-75">
            <MapPinIcon size={14} strokeWidth={2} />

            <span className="truncate">{location}</span>
          </div>
        </div>

        {attendees?.avatars && attendees.avatars.length > 0 && (
          <div className="mt-4 flex items-center">
            <div className="flex -space-x-2">
              {attendees.avatars.slice(0, 3).map((avatar, index) => (
                <Avatar key={index} className="h-6 w-6 border border-white">
                  <AvatarImage src={avatar} />

                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
            </div>
            {attendees.count > 3 && (
              <span className="ml-2 text-xs text-primary-75">
                +{attendees.count - 3} more
              </span>
            )}
          </div>
        )}

        {/* RSVP buttons for logged-in users */}
        {showRsvp && (
          <div className="mt-4 flex gap-2 border-t border-secondary-50 pt-3">
            <Button
              variant={rsvpStatus === "going" ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-1",
                rsvpStatus !== "going" &&
                  "border-primary-50 text-primary hover:bg-primary-10"
              )}
              onClick={(e) => handleRSVP(e, "going")}
              disabled={isAtCapacity && rsvpStatus !== "going"}
            >
              <UsersIcon size={14} className="mr-1" />
              {rsvpStatus === "going"
                ? "Going"
                : isAtCapacity
                  ? "Full"
                  : "Join"}
            </Button>
            <Button
              variant={rsvpStatus === "interested" ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "flex-1",
                rsvpStatus !== "interested" &&
                  "border-primary-50 text-primary hover:bg-primary-10"
              )}
              onClick={(e) => handleRSVP(e, "interested")}
            >
              <HeartIcon size={14} className="mr-1" />
              {rsvpStatus === "interested" ? "Interested" : "Interested"}
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}
