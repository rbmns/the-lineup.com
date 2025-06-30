
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { CategoryPill } from '@/components/ui/category-pill';
import { formatEventDateTime } from '@/utils/timezone-utils';
import { Card } from '@/components/ui/card';

interface MasterEventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  className?: string;
  onClick?: (event: Event) => void;
  loadingEventId?: string | null;
  children?: React.ReactNode;
}

export const MasterEventCard: React.FC<MasterEventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  className,
  onClick,
  loadingEventId,
  children,
}) => {
  const { navigateToEvent } = useEventNavigation();

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on RSVP buttons or other interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('[data-rsvp-container="true"]') || target.closest('button')) {
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick(event);
      return;
    }
    
    try {
      navigateToEvent(event);
    } catch (error) {
      console.error("Error navigating to event:", error);
    }
  };

  const getVenueDisplay = (): string => {
    if (event.venues?.name) {
      return event.venues.name;
    }
    
    if (event.location) {
      return event.location;
    }
    
    return 'Location TBD';
  };

  // Use the unified datetime formatting function
  const eventDateTime = formatEventDateTime({
    start_datetime: event.start_datetime,
    start_date: event.start_date || undefined,
    start_time: event.start_time || undefined,
    timezone: event.timezone
  });

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden",
        compact ? "p-3" : "p-4",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      <div className="space-y-3">
        {/* Header with title and category */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            "font-semibold text-[#005F73] line-clamp-2 flex-1",
            compact ? "text-sm" : "text-base"
          )}>
            {event.title}
          </h3>
          {event.event_category && (
            <CategoryPill 
              category={event.event_category} 
              size={compact ? "xs" : "sm"}
              showIcon={false}
            />
          )}
        </div>
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-[#005F73]/80">
          <Calendar className={cn("text-[#2A9D8F] flex-shrink-0", compact ? "h-3 w-3" : "h-4 w-4")} />
          <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            {eventDateTime.dateTime}
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-[#005F73]/80">
          <MapPin className={cn("text-[#2A9D8F] flex-shrink-0", compact ? "h-3 w-3" : "h-4 w-4")} />
          <span className={cn("font-medium truncate", compact ? "text-xs" : "text-sm")}>
            {getVenueDisplay()}
          </span>
        </div>

        {/* Attendance info */}
        {(event.going_count || event.interested_count) && (
          <div className="flex items-center gap-2 text-[#005F73]/80">
            <Users className={cn("text-[#2A9D8F] flex-shrink-0", compact ? "h-3 w-3" : "h-4 w-4")} />
            <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
              {event.going_count || 0} going{event.interested_count ? `, ${event.interested_count} interested` : ''}
            </span>
          </div>
        )}

        {/* Children (like RSVP buttons) */}
        {children && (
          <div data-rsvp-container="true">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};
