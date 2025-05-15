
import React from 'react';
import { Event } from '@/types';
import { formatRelativeDate, formatEventTime, getEventDateTime } from '@/utils/dateUtils';
import { useEventImages } from '@/hooks/useEventImages';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { CategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
  onShare?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onRsvp, 
  showRsvpButtons = true,
  compact = false,
  className,
  onClick,
  onShare
}) => {
  const { getEventImageUrl } = useEventImages();
  const navigate = useNavigate();
  
  const imageUrl = getEventImageUrl(event);
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on RSVP buttons or anything with data-rsvp-button or data-rsvp-container attribute
    if ((e.target as HTMLElement).closest('[data-rsvp-button]') || 
        (e.target as HTMLElement).closest('[data-rsvp-container]')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick();
    } else if (event && event.id) {
      // Make sure we have a valid event ID before navigating
      console.log(`Navigating to event detail with ID: ${event.id}`);
      navigate(`/events/${event.id}`);
    } else {
      console.error("Cannot navigate: Missing event ID", event);
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
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onShare) {
      onShare(event);
    }
  };
  
  // Generate the start time string from the combined date and time
  const eventStartTime = getEventDateTime(event);
  const eventEndTime = event.end_time;
  
  // Use card dimensions based on compact mode
  const cardHeight = compact ? 'h-[360px]' : 'h-[400px]';
  const imageHeight = compact ? 'h-[160px]' : 'h-[200px]';
  const contentPadding = compact ? 'p-3' : 'p-4';
  
  return (
    <div 
      className={cn(
        `bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300`,
        cardHeight,
        className
      )}
      onClick={handleCardClick}
      data-event-id={event.id}
    >
      <AspectRatio 
        ratio={16/9} 
        className={cn("bg-gray-100 overflow-hidden", imageHeight)}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No image
          </div>
        )}
        
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
      </AspectRatio>
      
      <div className={cn("flex flex-col justify-between", contentPadding, compact ? 'h-[200px]' : 'h-[200px]')}>
        <div className="space-y-2">
          <h3 className={cn("font-bold line-clamp-2", compact ? 'text-base' : 'text-lg')}>
            {event.title}
          </h3>
          
          <div className="flex flex-col text-sm text-gray-500 space-y-1">
            <p>{eventStartTime ? formatRelativeDate(eventStartTime) : 'Date not set'}</p>
            <p>{eventStartTime ? formatEventTime(eventStartTime, eventEndTime) : 'Time not set'}</p>
            {event.location && (
              <p className="line-clamp-1">{event.location}</p>
            )}
          </div>
        </div>
        
        {showRsvpButtons && onRsvp && (
          <div 
            className="mt-auto pt-3" 
            data-rsvp-container="true" 
            onClick={(e) => e.stopPropagation()}
          >
            <EventRsvpButtons 
              currentStatus={event.rsvp_status} 
              onRsvp={handleRsvp}
              size={compact ? 'sm' : 'md'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { EventCard };
export default EventCard;
