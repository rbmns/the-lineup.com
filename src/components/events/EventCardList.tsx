
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { toast } from '@/hooks/use-toast';
import { formatEventDateForCard, formatEventTimeRange } from '@/utils/timezone-utils';
import { LineupImage } from '@/components/ui/lineup-image';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

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
  const { isAuthenticated } = useAuth();
  const { navigateToEvent } = useEventNavigation();
  const { getEventImageUrl } = useEventImages();
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
      console.error('Error in EventCardList RSVP handler:', error);
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

  // Format date and time using new datetime fields
  const getFormattedDateTime = (): { date: string; time: string } => {
    const eventTimezone = event.timezone || 'Europe/Amsterdam';
    
    console.log('EventCardList formatting datetime:', {
      eventId: event.id,
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      timezone: eventTimezone
    });
    
    // Use start_datetime as primary source
    if (event.start_datetime) {
      try {
        const date = formatEventDateForCard(event.start_datetime, eventTimezone);
        const time = formatEventTimeRange(event.start_datetime, event.end_datetime, eventTimezone);
        
        console.log('EventCardList formatted result:', { date, time });
        return { date, time };
      } catch (error) {
        console.error('Error formatting datetime in EventCardList:', error);
        return { date: 'Date TBD', time: 'Time TBD' };
      }
    }
    
    console.log('EventCardList: No start_datetime found');
    return { date: 'Date TBD', time: 'Time TBD' };
  };

  const { date, time } = getFormattedDateTime();

  return (
    <div className={cn("w-full px-3 sm:px-4 lg:px-6", className)}>
      <Card 
        className={cn(
          "flex flex-col sm:flex-row gap-3 sm:gap-4 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden text-left rounded-xl shadow-sm border-gray-200 bg-white",
          "min-h-[120px] sm:h-28",
          className
        )}
        onClick={handleClick}
        data-event-id={event.id}
      >
        {/* Image with event category pill */}
        <div className="relative h-[100px] sm:h-auto sm:w-[120px] overflow-hidden bg-gray-100 flex-shrink-0">
          <LineupImage
            src={imageUrl}
            alt={event.title}
            aspectRatio="square"
            overlayVariant="ocean"
            className="h-full w-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('/img/default.jpg')) {
                console.log('Image failed to load, using default');
                target.src = "/img/default.jpg";
              }
            }}
          />
          
          {/* Event category pill - only this pill */}
          {event.event_category && (
            <div className="absolute top-2 left-2 z-30">
              <CategoryPill 
                category={event.event_category} 
                size="xs" 
                showIcon={false}
                className="bg-white/90 backdrop-blur-sm"
              />
            </div>
          )}

          {/* Event type as white text - top right */}
          {event.vibe && (
            <div className="absolute top-2 right-2 z-30">
              <span className="text-white text-xs font-medium px-1.5 py-0.5 bg-black/20 backdrop-blur-sm rounded">
                {event.vibe}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 justify-center text-left gap-1 sm:gap-2 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-[#005F73] text-sm sm:text-base leading-tight line-clamp-2 text-left break-words">
            {event.title}
          </h3>
            
          {/* Date */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#005F73]/80">
            <Calendar className="h-4 w-4 text-[#2A9D8F] flex-shrink-0" />
            <span className="font-medium">{date}</span>
          </div>

          {/* Time */}
          {time && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#005F73]/80">
              <Calendar className="h-4 w-4 text-[#2A9D8F] flex-shrink-0" />
              <span className="font-medium">{time}</span>
            </div>
          )}
          
          {/* Bottom row with location and RSVP buttons */}
          <div className="flex items-center justify-between gap-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#005F73]/80 text-left flex-1 min-w-0">
              <MapPin className="h-4 w-4 text-[#2A9D8F] flex-shrink-0" />
              <span className="font-medium truncate">
                {getVenueDisplay()}
              </span>
            </div>
            
            {/* RSVP Buttons - only show if authenticated */}
            {(shouldShowRsvp || showRsvpStatus) && onRsvp && shouldShowRsvp && (
              <div 
                className="flex-shrink-0" 
                data-rsvp-container="true" 
                onClick={(e) => e.stopPropagation()}
              >
                <EventRsvpButtons
                  currentStatus={event.rsvp_status || null}
                  onRsvp={handleRsvp}
                  size="sm"
                  showStatusOnly={!shouldShowRsvp && showRsvpStatus}
                />
                {/* Debug logging */}
                {(() => {console.log(`EventCardList rendering - Event ${event.id} RSVP status:`, event.rsvp_status); return null;})()}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventCardList;
