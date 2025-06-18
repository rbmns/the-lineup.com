
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
import { Card } from '@/components/ui/card';
import EventVibeLabel from '@/components/polymet/event-vibe-label';

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
    <Card 
      className={cn(
        "flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl bg-white border border-gray-200 rounded-sm",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image with category and vibe pills */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          treatment="subtle-overlay"
          overlayVariant="ocean"
          className="w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Image failed to load, using default');
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Category pill - top left */}
        {event.event_category && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryPill 
              category={event.event_category} 
              size="sm"
            />
          </div>
        )}

        {/* Event vibe pill - top right */}
        {event.vibe && (
          <div className="absolute top-3 right-3 z-10">
            <EventVibeLabel 
              vibe={event.vibe} 
              size="sm"
            />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
          {event.title}
        </h3>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="text-sm text-gray-600">
            By {event.organiser_name}
          </p>
        )}
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium">
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {getVenueDisplay()}
          </span>
        </div>

        {/* RSVP Buttons - only show if authenticated */}
        {shouldShowRsvp && onRsvp && (
          <div 
            className="mt-auto pt-3" 
            data-rsvp-container="true" 
            onClick={(e) => e.stopPropagation()}
          >
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size="sm"
              isLoading={loadingEventId === event.id}
              showStatusOnly={!shouldShowRsvp && showRsvpStatus}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
