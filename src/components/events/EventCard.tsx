
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { toast } from '@/hooks/use-toast';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { LineupImage } from '@/components/ui/lineup-image';
import { useAuth } from '@/contexts/AuthContext';
import { getVibeColors } from '@/utils/vibeColors';

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

  // Only show RSVP functionality if user is authenticated AND showRsvpButtons is true
  const shouldShowRsvp = isAuthenticated && showRsvpButtons;

  const handleClick = (e: React.MouseEvent) => {
    // Check for RSVP-related elements
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
        "bg-ivory border border-overcast rounded-sm p-4 sm:p-6 cursor-pointer transition-colors hover:bg-coconut w-full",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded-sm">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover img-cinematic"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Image failed to load, using default');
              target.src = "/img/default.jpg";
            }
          }}
        />
      </div>
      
      {/* Title */}
      <h3 className="font-display text-lg text-midnight mb-3 leading-tight">
        {event.title}
      </h3>
      
      {/* Organizer info */}
      {event.organiser_name && (
        <p className="font-mono text-xs text-overcast mb-3">
          By {event.organiser_name}
        </p>
      )}
      
      {/* Metadata */}
      <div className="font-mono text-xs text-overcast space-y-1 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="h-3 w-3" />
          <span>
            {getVenueDisplay()}
          </span>
        </div>
      </div>

      {/* Tags/Vibes and Category */}
      <div className="flex flex-wrap gap-2 mb-4">
        {event.vibe && (
          <span className="bg-sage text-midnight text-xs font-mono px-2 py-0.5 rounded lowercase">
            {event.vibe}
          </span>
        )}
        {event.event_category && (
          <span className="bg-sage text-midnight text-xs font-mono px-2 py-0.5 rounded lowercase">
            {event.event_category}
          </span>
        )}
      </div>

      {/* RSVP Buttons - show both Going and Interested buttons if authenticated */}
      {shouldShowRsvp && onRsvp && (
        <div 
          data-rsvp-container="true" 
          onClick={(e) => e.stopPropagation()}
        >
          <EventRsvpButtons
            currentStatus={event.rsvp_status}
            onRsvp={handleRsvp}
            isLoading={loadingEventId === event.id}
            className="w-full"
            size="default"
          />
        </div>
      )}
    </div>
  );
};
