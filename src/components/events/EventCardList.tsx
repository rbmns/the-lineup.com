import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { toast } from '@/hooks/use-toast';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { LineupImage } from '@/components/ui/lineup-image';
import { useAuth } from '@/contexts/AuthContext';

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

  // Format date and time for display
  const formattedDate = event.start_date ? formatDate(event.start_date) : '';
  const timeDisplay = event.start_time ? 
    formatEventTime(event.start_time, event.end_time) : '';

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
      <div 
        className={cn(
          "flex flex-col sm:flex-row gap-4 sm:h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden text-left",
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
          
          {/* Event category pill - UPDATED to not show icons */}
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
        
        {/* Content - Left aligned */}
        <div className="flex flex-col flex-1 p-3 py-2 justify-between text-left">
          {/* Title - Left aligned */}
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 text-left">
            {event.title}
          </h3>
            
          {/* Date and Time - Left aligned */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 text-left">
            <Calendar className="h-3 w-3" />
            <span>
              {formattedDate && timeDisplay ? (
                <>
                  {formattedDate} • {timeDisplay}
                </>
              ) : (
                formattedDate || 'Date not set'
              )}
            </span>
          </div>
          
          {/* Bottom row with location and RSVP buttons - Left aligned */}
          <div className="flex items-center justify-between mt-1">
            {/* Location - Left aligned */}
            <div className="flex items-center gap-1 text-xs text-gray-500 text-left">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[200px]">
                {event.venues?.name || event.location || 'No location'}
              </span>
            </div>
            
            {/* RSVP Buttons - now on the bottom right - only show if authenticated */}
            {(shouldShowRsvp || showRsvpStatus) && onRsvp && shouldShowRsvp && (
              <div 
                className="flex-shrink-0" 
                data-rsvp-container="true" 
                onClick={(e) => e.stopPropagation()}
              >
                <EventRsvpButtons
                  currentStatus={event.rsvp_status || null}
                  onRsvp={handleRsvp}
                  size="default"
                  showStatusOnly={!shouldShowRsvp && showRsvpStatus}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCardList;
