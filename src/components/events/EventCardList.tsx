
import React from 'react';
import { Event } from '@/types';
import { MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';

// Amsterdam/Netherlands timezone
const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

interface EventCardListProps {
  event: Event;
  showRsvpButtons?: boolean;
  showRsvpStatus?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
}

const EventCardList: React.FC<EventCardListProps> = ({
  event,
  showRsvpButtons = false,
  showRsvpStatus = false,
  onRsvp,
  className
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);
  
  // Format date for display - show only day of week and date
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, MMM d");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };
  
  const handleClick = () => {
    // Make sure we have all required properties for proper navigation
    if (event && event.id) {
      console.log(`EventCardList: Navigating to event with ID: ${event.id}`);
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
  };

  // Safely handle RSVP
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCardList RSVP handler:', error);
      return false;
    }
  };

  return (
    <div 
      className={cn(
        "flex border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 relative",
        "shadow-sm transition-all duration-200",
        className
      )}
      onClick={handleClick}
    >
      {/* Left: Event image - Full height with event type pill */}
      <div className="relative h-auto w-20 sm:w-24">
        <img 
          src={imageUrl} 
          alt={event.title} 
          className="absolute inset-0 h-full w-full object-cover"
          style={{ height: '100%' }}
        />
        
        {/* Event type pill positioned at top of image */}
        {event.event_type && (
          <div className="absolute top-1 left-1 z-10">
            <CategoryPill 
              category={event.event_type} 
              size="xs" 
              showIcon={true} 
              className="bg-white/90 backdrop-blur-sm shadow-sm text-xs py-0.5 px-1.5"
            />
          </div>
        )}
      </div>

      {/* Center: Event details */}
      <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Date */}
          <div className="text-sm text-gray-600 font-medium">
            {event.start_time && formatDate(event.start_time)}
          </div>
          
          {/* Event title */}
          <h3 className="font-medium text-base line-clamp-1">{event.title}</h3>
          
          {/* Location and RSVP status on the same line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{event.venues?.name || event.location || 'No location'}</span>
            </div>
            
            {/* Display RSVP status if not showing buttons */}
            {!showRsvpButtons && showRsvpStatus && event.rsvp_status && (
              <div 
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs font-medium rounded",
                  event.rsvp_status === 'Going' ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                )}
              >
                {event.rsvp_status}
              </div>
            )}
          </div>
        </div>
        
        {/* RSVP buttons - only shown when onRsvp handler is provided */}
        {showRsvpButtons && onRsvp && (
          <div className="flex items-center justify-end mt-2 gap-1">
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

export default EventCardList;
