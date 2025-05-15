
import React from 'react';
import { Event } from '@/types';
import { formatRelativeDate, formatEventTime, getEventDateTime } from '@/utils/dateUtils';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
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
  const { images, getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
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
    } else {
      navigateToEvent(event);
    }
  };
  
  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (onRsvp) {
      await onRsvp(event.id, status);
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
      </AspectRatio>
      
      <div className={cn("flex flex-col justify-between", contentPadding, compact ? 'h-[200px]' : 'h-[200px]')}>
        <div className="space-y-2">
          <div className="text-xs text-blue-600 font-medium">
            {event.event_type}
          </div>
          
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
              size={compact ? 'sm' : 'default'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { EventCard };
export default EventCard;

