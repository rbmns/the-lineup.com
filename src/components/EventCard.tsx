import React from 'react';
import { Event } from '@/types';
import { MapPin, Calendar, Clock, Check, Star } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { formatEventTime, formatDate, AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

export interface EventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
  onClick?: (event: Event) => void;
  view?: 'list' | 'grid';
  isLoading?: boolean;
  featured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className,
  onClick,
  view = 'grid',
  isLoading = false,
  featured = false
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);

  // Use the provided formatted date or generate one
  const displayDate = event.formattedDate || (event.start_date ? formatInTimeZone(
    new Date(event.start_date), 
    AMSTERDAM_TIMEZONE, 
    "EEE, d MMM"
  ) : '');
  
  // Use the provided formatted time or generate one
  const displayTime = event.formattedTime || (event.start_time ? 
    formatEventTime(event.start_time, event.end_time) : '');

  const handleClick = (e: React.MouseEvent) => {
    // Check if click originated from RSVP buttons
    if ((e.target as HTMLElement).closest('[data-rsvp-container="true"]') ||
        (e.target as HTMLElement).closest('[data-rsvp-button="true"]')) {
      return; // Don't navigate if clicked on RSVP buttons
    }
    
    if (onClick) {
      // Use the provided onClick handler if available
      onClick(event);
    } else {
      // Otherwise use the default navigation
      if (event && event.id) {
        navigateToEvent({
          ...event,
          id: event.id,
          destination: event.destination,
          slug: event.slug,
          start_time: event.start_time,
          title: event.title
        });
      } else {
        console.error("Cannot navigate: Missing event ID", event);
      }
    }
  };

  // Handle RSVP and ensure we always return a Promise<boolean>
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      // Convert any result (including void) to a boolean
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  // Determine card style based on props
  const cardStyle = featured ? "featured" : compact ? "compact" : "default";

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white flex flex-col h-full",
        cardStyle === "compact" ? "max-h-[280px]" : "",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
      data-card-style={cardStyle}
    >
      {/* Image container with event type label positioned on top */}
      <div className={cn(
        "relative overflow-hidden",
        cardStyle === "featured" ? "aspect-[4/3]" : "aspect-[16/9]"
      )}>
        <img
          src={imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        
        {/* Event type pill */}
        {event.event_type && (
          <div className="absolute top-2 left-2 z-10">
            <CategoryPill 
              category={event.event_type} 
              size="sm" 
              showIcon={true}
            />
          </div>
        )}
      </div>

      {/* Content Section - Using flex-grow to ensure this section takes up remaining space */}
      <div className={cn(
        "flex flex-col flex-grow",
        cardStyle === "compact" ? "p-3" : "p-4"
      )}>
        {/* Title */}
        <h3 className={cn(
          "font-semibold text-gray-900",
          cardStyle === "compact" ? "text-sm line-clamp-1 mb-1" : 
          cardStyle === "featured" ? "text-lg line-clamp-2 mb-2" : 
          "text-base line-clamp-2 mb-2"
        )}>
          {event.title}
        </h3>
        
        {/* Date & Time */}
        <div className="flex flex-col gap-1">
          {/* Date */}
          {displayDate && (
            <div className="flex items-center text-xs text-gray-700">
              <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="font-medium">{displayDate}</span>
            </div>
          )}
          
          {/* Time */}
          {displayTime && (
            <div className="flex items-center text-xs text-gray-700">
              <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>{displayTime}</span>
            </div>
          )}
          
          {/* Venue/Location */}
          <div className="flex items-center text-xs text-gray-700 mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">{event.venues?.name || event.location || 'No location'}</span>
          </div>
        </div>
        
        {/* RSVP count display */}
        {(event.going_count ?? 0) > 0 || (event.interested_count ?? 0) > 0 ? (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            {(event.going_count ?? 0) > 0 && (
              <span className="mr-3 flex items-center">
                <Check className="h-3 w-3 mr-1 text-green-500" />
                {event.going_count} going
              </span>
            )}
            {(event.interested_count ?? 0) > 0 && (
              <span className="flex items-center">
                <Star className="h-3 w-3 mr-1 text-blue-500" />
                {event.interested_count} interested
              </span>
            )}
          </div>
        ) : null}
        
        {/* Spacer - This will push the RSVP buttons to the bottom */}
        <div className="flex-grow min-h-[8px]"></div>
        
        {/* RSVP Buttons */}
        {showRsvpButtons && (
          <div 
            className="mt-auto" 
            data-rsvp-container="true"
            onClick={(e) => e.stopPropagation()}
          >
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size={cardStyle === "compact" ? "sm" : "default"}
              isLoading={isLoading}
              variant={cardStyle === "featured" ? "default" : "compact"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
