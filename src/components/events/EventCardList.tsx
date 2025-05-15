
import React from 'react';
import { Event } from '@/types';
import { MapPin, Check, Star } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';

// Amsterdam/Netherlands timezone
const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

interface EventCardListProps {
  event: Event;
  showRsvpStatus?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
}

const EventCardList: React.FC<EventCardListProps> = ({
  event,
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

  const handleRsvpClick = async (e: React.MouseEvent, status: 'Going' | 'Interested') => {
    e.stopPropagation();
    e.preventDefault();
    if (onRsvp) {
      await onRsvp(event.id, status);
    }
  };

  const isGoing = event.rsvp_status === 'Going';
  const isInterested = event.rsvp_status === 'Interested';

  return (
    <div 
      className={cn(
        "flex border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 relative",
        "shadow-sm transition-all duration-200",
        className
      )}
      onClick={handleClick}
    >
      {/* Left: Event image - Full height */}
      <div className="relative h-auto w-20 sm:w-24">
        <img 
          src={imageUrl} 
          alt={event.title} 
          className="absolute inset-0 h-full w-full object-cover"
          style={{ height: '100%' }}
        />
      </div>

      {/* Center: Event details */}
      <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Date and Event type pill on the same row */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              {event.start_time && formatDate(event.start_time)}
            </div>
          </div>
          
          {/* Event type pill */}
          {event.event_type && (
            <div className="mb-1">
              <CategoryPill 
                category={event.event_type} 
                size="sm"
                showIcon={true}
              />
            </div>
          )}
          
          {/* Event title */}
          <h3 className="font-medium text-base line-clamp-1">{event.title}</h3>
          
          {/* Location and RSVP status on the same line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{event.venues?.name || event.location || 'No location'}</span>
            </div>
            
            {/* Display RSVP status inline */}
            {showRsvpStatus && event.rsvp_status && (
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
        
        {/* RSVP action buttons - only shown when onRsvp handler is provided */}
        {onRsvp && (
          <div className="flex items-center justify-end mt-2 gap-1">
            <div className="flex gap-1">
              <button
                className={cn(
                  "flex items-center justify-center rounded-md w-10 h-10 border",
                  isGoing ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700 border-gray-300"
                )}
                onClick={(e) => handleRsvpClick(e, 'Going')}
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "flex items-center justify-center rounded-md w-10 h-10 border",
                  isInterested ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300"
                )}
                onClick={(e) => handleRsvpClick(e, 'Interested')}
              >
                <Star className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCardList;
