
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventImages } from '@/hooks/useEventImages';
import { toast } from '@/hooks/use-toast';
import { formatEventDateForCard, formatEventTimeRange } from '@/utils/timezone-utils';
import { useAuth } from '@/contexts/AuthContext';

interface MasterEventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  showRsvpStatus?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
  onClick?: (event: Event) => void;
  loadingEventId?: string | null;
  children?: React.ReactNode;
}

export const MasterEventCard: React.FC<MasterEventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = true,
  showRsvpStatus = false,
  onRsvp,
  className,
  onClick,
  loadingEventId,
  children,
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

  const getVenueDisplay = (): string => {
    // Prioritize venue name first
    if (event.venues?.name) {
      return event.venues.name;
    }
    
    // Check for location field
    if (event.location) {
      return event.location;
    }
    
    // Check for destination (city/area)
    if (event.destination) {
      return event.destination;
    }
    
    return 'Location TBD';
  };

  // Format date and time using the new datetime fields
  const getFormattedDateTime = (): { date: string; time: string } => {
    const eventTimezone = event.timezone || 'Europe/Amsterdam';
    
    console.log('MasterEventCard formatting datetime:', {
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
        
        console.log('MasterEventCard formatted result:', { date, time });
        return { date, time };
      } catch (error) {
        console.error('Error formatting datetime:', error);
        return { date: 'Date TBD', time: 'Time TBD' };
      }
    }
    
    console.log('MasterEventCard: No start_datetime found');
    return { date: 'Date TBD', time: 'Time TBD' };
  };

  const { date, time } = getFormattedDateTime();

  return (
    <div 
      className={cn(
        // Container styling with uniform dimensions - warm coconut background
        "bg-coconut rounded-lg shadow-md border border-mist-grey p-5",
        "h-full flex flex-col cursor-pointer transition-all duration-200 ease-in-out",
        "hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image Container - Fixed height for uniformity */}
      <div className="relative w-full overflow-hidden mb-4 rounded-t-md h-40 md:h-48">
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
        
        {/* Category badge overlay */}
        {event.event_category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-sand-pink text-dusk-coral font-mono text-xs">
              {event.event_category}
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section - Flexible grow area */}
      <div className="flex flex-col flex-grow">
        {/* Title - Keep original font (Montserrat) */}
        <h4 className="text-h4 text-graphite-grey font-montserrat mb-2 line-clamp-2">
          {event.title}
        </h4>
        
        {/* Organizer info - Use JetBrains Mono */}
        {event.organiser_name && (
          <p className="text-sm text-graphite-grey opacity-75 font-mono mb-3">
            By {event.organiser_name}
          </p>
        )}
        
        {/* Date - Use JetBrains Mono */}
        <div className="text-sm text-graphite-grey opacity-75 font-mono mb-2 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-ocean-teal flex-shrink-0" />
          <span>{date}</span>
        </div>

        {/* Time - Use JetBrains Mono */}
        {time && (
          <div className="text-sm text-graphite-grey opacity-75 font-mono mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ocean-teal flex-shrink-0" />
            <span>{time}</span>
          </div>
        )}
        
        {/* Location - Use JetBrains Mono */}
        <div className="text-sm text-graphite-grey font-mono flex items-center mb-4 hover:underline hover:text-ocean-teal">
          <MapPin className="h-4 w-4 text-graphite-grey mr-2 flex-shrink-0" />
          <span className="truncate">{getVenueDisplay()}</span>
        </div>
        
        {/* RSVP Status Display - Use JetBrains Mono */}
        {showRsvpStatus && event.rsvp_status && (
          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-mono font-medium",
              event.rsvp_status === 'Going' 
                ? "bg-ocean-teal/20 text-ocean-teal" 
                : "bg-sunrise-ochre/20 text-graphite-grey"
            )}>
              {event.rsvp_status}
            </span>
          </div>
        )}
        
        {/* Children (typically RSVP buttons) - Always at bottom */}
        {children && (
          <div className="mt-auto" data-rsvp-container="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
