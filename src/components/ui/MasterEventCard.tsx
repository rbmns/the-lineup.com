
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
  children?: React.ReactNode; // For custom RSVP buttons or other content
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

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp || !shouldShowRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in MasterEventCard RSVP handler:', error);
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
    <div 
      className={cn(
        "bg-coconut border border-clay/20 rounded-md p-4 sm:p-6 cursor-pointer transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-coastal-hover hover:border-clay/30 w-full group",
        className
      )}
      onClick={handleClick}
      data-event-id={event.id}
    >
      {/* Image */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter-warm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              target.src = "/img/default.jpg";
            }
          }}
        />
      </div>
      
      {/* Title */}
      <h3 className="font-display text-lg text-midnight mb-3 leading-tight font-semibold">
        {event.title}
      </h3>
      
      {/* Organizer info */}
      {event.organiser_name && (
        <p className="font-mono text-xs text-overcast mb-3 uppercase tracking-wide">
          By {event.organiser_name}
        </p>
      )}
      
      {/* Metadata */}
      <div className="font-mono text-xs text-overcast space-y-2 mb-4 uppercase tracking-wide">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-clay" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-clay" />
          <span>
            {getVenueDisplay()}
          </span>
        </div>
      </div>

      {/* Tags/Vibes and Category - unified styling */}
      <div className="flex flex-wrap gap-2 mb-4">
        {event.vibe && (
          <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-midnight/10 text-midnight uppercase tracking-wide border border-midnight/20">
            {event.vibe}
          </span>
        )}
        {event.event_category && (
          <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-ocean-deep/15 text-ocean-deep uppercase tracking-wide border border-ocean-deep/25">
            {event.event_category}
          </span>
        )}
      </div>

      {/* Custom content or RSVP buttons */}
      {children ? (
        <div 
          data-rsvp-container="true" 
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      ) : shouldShowRsvp && onRsvp && (
        <div 
          data-rsvp-container="true" 
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn-primary w-full px-4 py-2.5 text-sm font-medium rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              handleRsvp('Going');
            }}
            disabled={loadingEventId === event.id}
          >
            {event.rsvp_status === 'Going' ? 'Going' : 'Join Event'}
          </button>
        </div>
      )}
    </div>
  );
};
