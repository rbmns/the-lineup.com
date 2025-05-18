
import React from 'react';
import { Event } from '@/types';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
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
  loadingEventId?: string | null;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className,
  onClick,
  loadingEventId
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);
  
  // For debugging
  console.log(`EventCard rendering for ${event.id} with rsvp_status:`, event.rsvp_status);

  // Format date for display
  const formattedDate = event.start_date ? formatDate(event.start_date) : 
                        (event.start_time ? formatDate(event.start_time) : '');
  
  // Format time using the 24-hour time format
  const timeDisplay = event.start_time ? 
    formatEventTime(event.start_time, event.end_time) : '';

  const handleClick = (e: React.MouseEvent) => {
    // Check if click originated from RSVP buttons
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

  // Enhanced RSVP handler that ensures the return value is always a Promise<boolean>
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log(`EventCard: Handling RSVP for event ${event.id}, status: ${status}`);
      const result = await onRsvp(event.id, status);
      // Convert any result (including void) to a boolean
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  // Determine if this specific event is loading
  const isLoading = loadingEventId === event.id;
  
  // Determine card height
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
          {formattedDate && timeDisplay ? (
            <>
              {formattedDate} • {timeDisplay}
            </>
          ) : (
            formattedDate || 'Date not set'
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
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
