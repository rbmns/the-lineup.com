
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

interface EventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = false,
  onRsvp,
  className
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const imageUrl = getEventImageUrl(event);

  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEE, MMM d · h:mm a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  const handleClick = () => {
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
  };

  // Determine max height for compact vs standard view
  const cardHeightClass = compact ? "max-h-[280px]" : "max-h-[380px]";

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white",
        cardHeightClass,
        className
      )}
      onClick={handleClick}
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

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Date */}
        <div className="text-sm text-gray-600 font-medium">
          {event.start_time && formatDate(event.start_time)}
        </div>
        
        {/* Title */}
        <h3 className={cn(
          "font-semibold text-gray-900",
          compact ? "text-base line-clamp-2" : "text-xl line-clamp-2"
        )}>
          {event.title}
        </h3>
        
        {/* Venue/Location */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{event.venues?.name || event.location || 'No location'}</span>
        </div>
        
        {/* RSVP Buttons - only if needed */}
        {showRsvpButtons && (
          <div className="pt-3">
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={(status) => onRsvp ? onRsvp(event.id, status) : Promise.resolve(false)}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
