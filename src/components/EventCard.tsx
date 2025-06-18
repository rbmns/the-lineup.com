
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
    
    // Use custom onClick handler if provided (for search results)
    if (onClick) {
      console.log('EventCard - using custom onClick handler for event:', event.id);
      onClick(event);
      return;
    }
    
    // Fallback to default navigation
    try {
      console.log('EventCard - using default navigation for event:', event.id);
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
      return event.venues.name;
    }
    
    // Second priority: location field (legacy)
    if (event.location) {
      return event.location;
    }
    
    // Fallback
    return 'Location TBD';
  };

  return (
    <Card 
      className={cn(
        "group flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200",
        "h-full w-full", // Ensure consistent sizing
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image Section - Always show image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          overlayVariant="ocean"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Image failed to load, using default');
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Category pill overlay */}
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
      
      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 text-left">
        {/* Title */}
        <h3 className="font-semibold text-black text-base leading-tight mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {getVenueDisplay()}
          </span>
        </div>
        
        {/* Attendees count if available */}
        {(event.attendees?.going || event.going_count) && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {event.attendees?.going || event.going_count || 0} attending
            </span>
          </div>
        )}
        
        {/* RSVP Buttons - only show if authenticated and requested */}
        {shouldShowRsvp && onRsvp && (
          <div 
            className="mt-auto" 
            data-rsvp-container="true" 
            onClick={(e) => e.stopPropagation()}
          >
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size="sm"
              showStatusOnly={!shouldShowRsvp && showRsvpStatus}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
