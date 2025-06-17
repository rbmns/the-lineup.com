
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin, Users } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  showRsvpButtons = false,
  showRsvpStatus = false,
  onRsvp,
  className,
  onClick,
  loadingEventId,
}) => {
  const { isAuthenticated } = useAuth();
  const { navigateToEvent } = useEventNavigation();
  const { getEventImageUrl } = useEventImages();
  const isMobile = useIsMobile();
  const imageUrl = getEventImageUrl(event);

  // Only show RSVP functionality if user is authenticated AND showRsvpButtons is true
  const shouldShowRsvp = isAuthenticated && showRsvpButtons;

  const handleClick = (e: React.MouseEvent) => {
    // More thorough check for RSVP-related elements
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

  // Handle RSVP and ensure we always return a Promise<boolean>
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp || !shouldShowRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      // Convert any result (including void) to a boolean
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  // Get venue display name with proper fallback
  const getVenueDisplay = (): string => {
    // First priority: venue name from venues table
    if (event.venues?.name) {
      // If venue has a city and it's different from the name, include it
      if (event.venues.city && event.venues.city !== event.venues.name) {
        return `${event.venues.name}, ${event.venues.city}`;
      }
      return event.venues.name;
    }
    
    // Second priority: location field (legacy)
    if (event.location) {
      return event.location;
    }
    
    // Fallback
    return 'Location TBD';
  };

  const totalAttendees = (event.going_count || 0) + (event.interested_count || 0);

  return (
    <Card 
      className={cn(
        "flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl bg-white border border-gray-200 rounded-xl",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image with better mobile sizing */}
      <div className={cn(
        "relative w-full overflow-hidden bg-gray-100 flex-shrink-0",
        isMobile ? "h-48" : "h-56"
      )}>
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Image failed to load, using default');
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Event category pill */}
        {event.event_category && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryPill 
              category={event.event_category} 
              size="sm" 
              showIcon={false} 
            />
          </div>
        )}
      </div>
      
      {/* Content with better mobile spacing */}
      <div className={cn(
        "flex flex-col flex-1 justify-between",
        isMobile ? "p-4" : "p-5"
      )}>
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {event.title}
          </h3>
          
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium">
              {formatEventCardDateTime(event.start_date, event.start_time)}
            </span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {getVenueDisplay()}
            </span>
          </div>

          {/* Attendees count */}
          {totalAttendees > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>
                {totalAttendees} {totalAttendees === 1 ? 'person' : 'people'} interested
              </span>
            </div>
          )}
        </div>
        
        {/* RSVP Buttons - only show if authenticated */}
        {shouldShowRsvp && onRsvp && (
          <div 
            className="mt-4 pt-3 border-t border-gray-100" 
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
