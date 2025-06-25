
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
        "group flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 bg-white border border-gray-100 rounded-2xl",
        "bg-gradient-to-b from-white to-gray-50/30",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image with category and vibe pills */}
      <div className="relative w-full h-52 overflow-hidden bg-gradient-to-br from-blue-100 to-emerald-100 flex-shrink-0">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          treatment="subtle-overlay"
          overlayVariant="ocean"
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Image failed to load, using default');
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
        
        {/* Category pill - top left */}
        {event.event_category && (
          <div className="absolute top-4 left-4 z-10">
            <CategoryPill 
              category={event.event_category} 
              size="sm"
              className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg"
            />
          </div>
        )}

        {/* Event vibe pill - top right */}
        <div className="absolute top-4 right-4 z-10">
          <EventVibeLabel 
            vibe={event.vibe || 'general'} 
            size="sm"
            className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-2 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
          {event.title}
        </h3>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="text-sm text-gray-600 font-medium">
            By <span className="text-emerald-600">{event.organiser_name}</span>
          </p>
        )}
        
        {/* Date and Time */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <span className="font-semibold">
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <span className="truncate font-medium">
            {getVenueDisplay()}
          </span>
        </div>

        {/* RSVP Buttons - only show if authenticated */}
        {shouldShowRsvp && onRsvp && (
          <div 
            className="mt-auto pt-4 border-t border-gray-100" 
            data-rsvp-container="true" 
            onClick={(e) => e.stopPropagation()}
          >
            <EventRsvpButtons
              currentStatus={event.rsvp_status || null}
              onRsvp={handleRsvp}
              size="sm"
              isLoading={loadingEventId === event.id}
              showStatusOnly={!shouldShowRsvp && showRsvpStatus}
              className="w-full"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
