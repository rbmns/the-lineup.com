
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventImages } from '@/hooks/useEventImages';
import { toast } from '@/hooks/use-toast';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const imageUrl = getEventImageUrl(event);

  const shouldShowRsvp = isAuthenticated && showRsvpButtons;

  // Determine which page we're on for description display
  const isHomePage = location.pathname === '/';
  const isEventsPage = location.pathname === '/events';
  const isDetailPage = location.pathname.includes('/events/');

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

  const getDescriptionClass = (): string => {
    if (isHomePage) return 'event-card-description-home';
    if (isEventsPage) return 'event-card-description-events';
    if (isDetailPage) return 'event-card-description-detail';
    return 'event-card-description-home'; // Default fallback
  };

  return (
    <div 
      className={cn("event-card", className)}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image Container with Fixed Height */}
      <div className="event-card-image">
        <img
          src={imageUrl}
          alt={event.title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Category badge overlay */}
        {event.event_category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="event-card-category-tag">
              {event.event_category}
            </span>
          </div>
        )}
      </div>
      
      {/* Flexible Content Section */}
      <div className="event-card-content">
        {/* Title */}
        <h4 className="event-card-title">
          {event.title}
        </h4>
        
        {/* Organizer info */}
        {event.organiser_name && (
          <p className="event-card-metadata">
            By {event.organiser_name}
          </p>
        )}
        
        {/* Date & Time */}
        <div className="event-card-metadata flex items-center gap-2">
          <Calendar className="h-4 w-4 text-ocean-teal flex-shrink-0" />
          <span>{formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}</span>
        </div>
        
        {/* Location */}
        <div className="event-card-location">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{getVenueDisplay()}</span>
        </div>
        
        {/* Description - Conditional Display Based on Page */}
        {event.description && (
          <div className={cn("event-card-description", getDescriptionClass())}>
            {event.description}
          </div>
        )}
        
        {/* RSVP Status Display */}
        {showRsvpStatus && event.rsvp_status && (
          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              "event-card-category-tag",
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
          <div className="event-card-cta" data-rsvp-container="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
