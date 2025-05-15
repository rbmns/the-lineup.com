
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';

// Amsterdam timezone for date formatting
const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

interface EventCardListProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
}

const EventCardList: React.FC<EventCardListProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className,
}) => {
  const { navigateToEvent } = useEventNavigation();
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  const handleClick = () => {
    navigateToEvent(event);
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEEE, MMMM d · h:mm a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
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
      console.error('Error in EventCardList RSVP handler:', error);
      return false;
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row gap-4 sm:h-[140px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-[120px] sm:h-auto sm:w-[180px] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={event.title}
          className="h-full w-full object-cover"
        />
        
        {/* Event type pill positioned at top of image */}
        {event.event_type && (
          <div className="absolute top-2 left-2">
            <CategoryPill 
              category={event.event_type} 
              size="sm" 
              showIcon={true} 
              className="bg-white/90 backdrop-blur-sm shadow-sm"
            />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pt-0 sm:pt-4 justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{event.start_time ? formatDate(event.start_time) : 'Date not set'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">
                {event.venues?.name || event.location || 'No location'}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {event.description || 'No description available'}
          </p>
        </div>
        
        {/* RSVP Buttons - only if needed */}
        {showRsvpButtons && onRsvp && (
          <div className="mt-auto">
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
