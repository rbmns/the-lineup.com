import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { toast } from '@/hooks/use-toast';
import { formatEventTime, AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

interface EventCardListProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  showRsvpStatus?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
  onClick?: (event: Event) => void;
}

const EventCardList: React.FC<EventCardListProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  showRsvpStatus = false,
  onRsvp,
  className,
  onClick,
}) => {
  const { navigateToEvent } = useEventNavigation();
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on RSVP buttons
    if ((e.target as HTMLElement).closest('[data-rsvp-button]') || 
        (e.target as HTMLElement).closest('[data-rsvp-container]')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick(event);
      return;
    }
    
    try {
      // Use hook for consistent navigation
      navigateToEvent(event);
    } catch (error) {
      console.error("Error navigating to event:", error);
      toast({
        title: "Navigation Error",
        description: "Could not navigate to event page",
        variant: "destructive",
      });
    }
  };

  // Format date for display - European format
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, d MMM");
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
        "flex flex-col sm:flex-row gap-4 sm:h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image with event type pill */}
      <div className="relative h-[100px] sm:h-auto sm:w-[120px] overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={event.title}
          className="h-full w-full object-cover"
        />
        {/* Event type pill */}
        {event.event_type && (
          <div className="absolute top-2 left-2">
            <CategoryPill 
              category={event.event_type} 
              size="xs" 
              showIcon={false} 
            />
          </div>
        )}
      </div>
      
      {/* Content - More compact layout */}
      <div className="flex flex-col flex-1 p-3 py-2 justify-between">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
          {event.title}
        </h3>
          
        {/* Date and Time */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Calendar className="h-3 w-3" />
          <span>
            {event.start_time ? (
              <>
                {formatDate(event.start_time)} • {formatEventTime(event.start_time, event.end_time)}
              </>
            ) : 'Date not set'}
          </span>
        </div>
        
        {/* Bottom row with location and RSVP buttons */}
        <div className="flex items-center justify-between mt-1">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[200px]">
              {event.venues?.name || event.location || 'No location'}
            </span>
          </div>
          
          {/* RSVP Buttons - now on the bottom right */}
          {(showRsvpButtons || showRsvpStatus) && onRsvp && (
            <div 
              className="flex-shrink-0" 
              data-rsvp-container="true" 
              onClick={(e) => e.stopPropagation()}
            >
              <EventRsvpButtons
                currentStatus={event.rsvp_status || null}
                onRsvp={handleRsvp}
                size="sm"
                showStatusOnly={!showRsvpButtons && showRsvpStatus}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCardList;
