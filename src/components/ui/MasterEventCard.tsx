
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventImages } from '@/hooks/useEventImages';
import { toast } from '@/hooks/use-toast';
import { formatEventCardDateTime } from '@/utils/date-formatting';
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
        "event-card group w-full h-full flex flex-col",
        "cursor-pointer transition-smooth hover-lift",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Event Image - using design system image class */}
      <div className="event-card-image relative overflow-hidden">
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
            <span className="event-card-tag">
              {event.event_category}
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Title - using design system typography */}
        <h3 className="event-card-title">
          {event.title}
        </h3>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="event-card-meta">
            By {event.organiser_name}
          </p>
        )}
        
        {/* Date & Time */}
        <div className="event-card-meta flex items-center gap-2">
          <Calendar className="h-4 w-4 text-ocean-teal flex-shrink-0" />
          <span>{formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}</span>
        </div>
        
        {/* Location */}
        <div className="event-card-location flex items-center gap-2">
          <MapPin className="h-4 w-4 text-ocean-teal flex-shrink-0" />
          <span className="truncate">{getVenueDisplay()}</span>
        </div>
        
        {/* Description (if available and not compact) */}
        {event.description && !compact && (
          <p className="event-card-description line-clamp-2">
            {event.description}
          </p>
        )}
        
        {/* RSVP Status Display */}
        {showRsvpStatus && event.rsvp_status && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              event.rsvp_status === 'Going' 
                ? "bg-ocean-teal/20 text-ocean-teal" 
                : "bg-sunrise-ochre/20 text-graphite-grey"
            )}>
              {event.rsvp_status}
            </span>
          </div>
        )}
        
        {/* Children (typically RSVP buttons) */}
        {children && (
          <div className="mt-auto pt-2" data-rsvp-container="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
