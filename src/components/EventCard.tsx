import React from 'react';
import { Event } from '@/types';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pills';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { formatDate, formatEventTime } from '@/utils/date-formatting';

export interface EventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
  onClick?: (event: Event) => void;
  isRsvpLoading?: boolean;
  loadingEventId?: string | null;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className,
  onClick,
  isRsvpLoading = false,
  loadingEventId
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);

  // Format date and time display
  const formatDateDisplay = (): string => {
    if (event.formattedDate) return event.formattedDate;
    
    // First try to use start_date (preferred)
    if (event.start_date) {
      return formatDate(event.start_date);
    }
    
    // Fall back to start_time if available
    if (event.start_time) {
      return formatDate(event.start_time);
    }
    
    return 'Date not specified';
  };
  
  // Get formatted event time
  const getEventTimeDisplay = (): string => {
    if (event.formattedTime) return event.formattedTime;
    
    if (!event.start_time) return '';
    
    return formatEventTime(event.start_time, event.end_time);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on RSVP buttons
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

  // Handle RSVP and ensure we always return a Promise<boolean>
  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      const result = await onRsvp(eventId, status);
      // Convert any result (including void) to a boolean
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  // Determine if RSVP is loading for this specific event
  const isThisEventRsvpLoading = isRsvpLoading || loadingEventId === event.id;

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
      {/* Image container with event type label positioned on top */}
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
              showIcon={false}
              active={true}
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
          {formatDateDisplay()} {getEventTimeDisplay() && `• ${getEventTimeDisplay()}`}
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
              eventId={event.id}
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size="sm"
              isLoading={isThisEventRsvpLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
