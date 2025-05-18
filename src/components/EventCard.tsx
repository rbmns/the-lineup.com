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
  loadingEventId?: string | null; // Added to pass down to EventRsvpButtons
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className,
  onClick,
  loadingEventId // Added
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);

  const formatDateDisplay = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, d MMM yyyy");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };
  
  const getEventTimeDisplay = (currentEvent: Event): string => { // Renamed event to currentEvent to avoid conflict
    if (!currentEvent.start_time) return '';
    return formatEventTime(currentEvent.start_time, currentEvent.end_time);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-rsvp-container="true"]')) {
      return; 
    }
    
    if (onClick) {
      onClick(event);
    } else {
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

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  const cardHeightClass = compact ? "max-h-[280px]" : ""; // Ensure this is still relevant or adjust

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
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        
        {event.event_type && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryPill 
              category={event.event_type} 
              size="default" 
              showIcon={true}
            />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow space-y-2">
        <h3 className={cn(
          "font-semibold text-gray-900",
          compact ? "text-base line-clamp-2" : "text-xl line-clamp-2"
        )}>
          {event.title}
        </h3>
        
        <div className="text-sm text-gray-600 font-medium">
          {event.start_time && (
            <>
              {formatDateDisplay(event.start_time)} • {getEventTimeDisplay(event)}
            </>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{event.venues?.name || event.location || 'No location'}</span>
        </div>
        
        <div className="flex-grow min-h-[8px]"></div>
        
        {showRsvpButtons && (
          <div 
            className="mt-2" 
            data-rsvp-container="true"
            onClick={(e) => e.stopPropagation()}
          >
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size="sm"
              // Pass the loading state for *this specific event*
              isLoading={loadingEventId === event.id} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
