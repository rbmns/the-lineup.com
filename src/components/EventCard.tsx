
import React from 'react';
import { Event } from '@/types';
import { MapPin } from 'lucide-react';
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
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className,
  onClick
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);

  // Format date for display - now using European format (DD-MM-YYYY)
  const formatDateDisplay = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, d MMM yyyy");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };
  
  // Format time using the 24-hour time format
  const getEventTimeDisplay = (event: Event): string => {
    if (!event.start_time) return '';
    
    return formatEventTime(event.start_time, event.end_time);
  };

  const handleClick = () => {
    if (onClick) {
      // Use the provided onClick handler if available
      onClick(event);
    } else {
      // Otherwise use the default navigation
      // Make sure we have all required properties for proper navigation
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

  // Determine max height for compact vs standard view
  const cardHeightClass = compact ? "max-h-[280px]" : "";

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white flex flex-col h-full",
        cardHeightClass,
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image container with absolute positioned category pill */}
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        
        {/* Event type pill positioned at top of image */}
        {event.event_type && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryPill 
              category={event.event_type} 
              size="sm" 
              showIcon={true} 
              className="bg-white/90 backdrop-blur-sm shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Content Section - Updated layout */}
      <div className="p-4 flex flex-col flex-grow space-y-2">
        {/* Title - Now first */}
        <h3 className={cn(
          "font-semibold text-gray-900",
          compact ? "text-base line-clamp-2" : "text-xl line-clamp-2"
        )}>
          {event.title}
        </h3>
        
        {/* Date & Time - Now second */}
        <div className="text-sm text-gray-600 font-medium">
          {event.start_time && (
            <>
              {formatDateDisplay(event.start_time)} • {getEventTimeDisplay(event)}
            </>
          )}
        </div>
        
        {/* Venue/Location - Now third */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{event.venues?.name || event.location || 'No location'}</span>
        </div>
        
        {/* Spacer to push RSVP buttons to bottom */}
        <div className="flex-grow"></div>
        
        {/* RSVP Buttons - only if needed */}
        {showRsvpButtons && (
          <div className="mt-2">
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
