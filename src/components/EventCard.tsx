
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventImages } from '@/hooks/useEventImages';
import { toast } from '@/hooks/use-toast';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { useAuth } from '@/contexts/AuthContext';

interface EventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  showRsvpStatus?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
  onClick?: (event: Event) => void;
  loadingEventId?: string | null;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = true,
  showRsvpStatus = false,
  onRsvp,
  className,
  onClick,
  loadingEventId,
}) => {
  const { isAuthenticated } = useAuth();
  const { navigateToEvent } = useEventNavigation();
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  const shouldShowRsvp = isAuthenticated && showRsvpButtons;

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isRsvpElement = 
      target.closest('[data-rsvp-container="true"]') || 
      target.closest('[data-rsvp-button="true"]') ||
      target.hasAttribute('data-rsvp-button') ||
      target.closest('button[data-status]');
    
    if (isRsvpElement) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(event);
      return;
    }
    
    try {
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

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp || !shouldShowRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  const getVenueDisplay = (): string => {
    if (event.venues?.name) {
      return event.venues.name;
    }
    
    if (event.location) {
      return event.location;
    }
    
    return 'Location TBD';
  };

  return (
    <div 
      className={cn(
        "bg-coconut border border-ocean-deep/10 rounded-md p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-coastal hover:bg-vibrant-aqua/5 w-full group",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              target.src = "/img/default.jpg";
            }
          }}
        />
      </div>
      
      {/* Title */}
      <h3 className="font-display text-lg text-ocean-deep mb-3 leading-tight font-semibold">
        {event.title}
      </h3>
      
      {/* Organizer info */}
      {event.organiser_name && (
        <p className="font-mono text-xs text-ocean-deep/70 mb-3 uppercase tracking-wide">
          By {event.organiser_name}
        </p>
      )}
      
      {/* Metadata */}
      <div className="font-mono text-xs text-ocean-deep/70 space-y-2 mb-4 uppercase tracking-wide">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-vibrant-aqua" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-vibrant-aqua" />
          <span>
            {getVenueDisplay()}
          </span>
        </div>
      </div>

      {/* Tags/Vibes and Category - coastal pill styling */}
      <div className="flex flex-wrap gap-2 mb-4">
        {event.vibe && (
          <span className="bg-vibrant-aqua/20 text-ocean-deep text-xs font-mono font-medium px-2.5 py-1 rounded-full uppercase tracking-wide">
            {event.vibe}
          </span>
        )}
        {event.event_category && (
          <span className="bg-ocean-deep/10 text-ocean-deep text-xs font-mono font-medium px-2.5 py-1 rounded-full uppercase tracking-wide">
            {event.event_category}
          </span>
        )}
      </div>

      {/* RSVP Button - coastal primary style */}
      {shouldShowRsvp && onRsvp && (
        <div 
          data-rsvp-container="true" 
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="bg-ocean-deep text-coconut text-sm font-body font-medium px-4 py-2.5 rounded-md hover:bg-ocean-deep/90 transition-all duration-200 hover:-translate-y-0.5 shadow-coastal w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleRsvp('Going');
            }}
            disabled={loadingEventId === event.id}
          >
            {event.rsvp_status === 'Going' ? 'Going' : 'Join Event'}
          </button>
        </div>
      )}
    </div>
  );
};
