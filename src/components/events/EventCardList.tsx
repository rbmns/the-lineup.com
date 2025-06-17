
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

  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-8", className)}>
      <Card 
        className={cn(
          "flex flex-col sm:flex-row gap-4 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden text-left rounded-xl shadow-md border-gray-200 bg-white",
          "min-h-[120px] sm:h-28",
          className
        )}
        onClick={handleClick}
        data-event-id={event.id}
      >
        {/* Image with event type pill */}
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
          
          {/* Event category pill */}
          {event.event_category && (
            <div className="absolute top-2 left-2 z-30">
              <CategoryPill 
                category={event.event_category} 
                size="xs" 
                showIcon={false} 
              />
            </div>
          )}
        </div>
        
        {/* Content - Better structured */}
        <div className="flex flex-col flex-1 p-4 sm:p-3 justify-center text-left gap-2">
          {/* Title */}
          <h3 className="font-inter font-semibold text-black text-base sm:text-lg line-clamp-1 text-left leading-tight">
            {event.title}
          </h3>
            
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="font-inter">
              {formatEventCardDateTime(event.start_date, event.start_time)}
            </span>
          </div>
          
          {/* Bottom row with location and RSVP buttons */}
          <div className="flex items-center justify-between gap-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 text-left flex-1 min-w-0">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="font-inter truncate">
                {event.venues?.name || event.location || 'No location'}
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
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventCardList;
