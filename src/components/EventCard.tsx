
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { LineupImage } from '@/components/ui/lineup-image';
import { MapPin, Calendar } from 'lucide-react';
import { formatDate, formatEventTime, formatEventCardDateTime } from '@/utils/date-formatting';
import { useEventImages } from '@/hooks/useEventImages';
import { Event } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEventNavigation } from '@/hooks/useEventNavigation';

interface EventCardProps {
  event: Event;
  className?: string;
  showCategory?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  onClick?: (event: Event) => void;
  compact?: boolean;
  loadingEventId?: string | null;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  className = '',
  showCategory = true,
  onRsvp,
  showRsvpButtons = false,
  onClick,
  compact = false,
  loadingEventId
}) => {
  const { getEventImageUrl } = useEventImages();
  const { navigateToEvent } = useEventNavigation();
  const isMobile = useIsMobile();

  const eventImage = getEventImageUrl(event);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(event);
    } else {
      // Use navigation hook which will scroll to top
      e.preventDefault();
      navigateToEvent(event, false); // false = don't preserve scroll
    }
  };

  const handleRsvpClick = async (e: React.MouseEvent, status: 'Going' | 'Interested') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onRsvp) {
      // For RSVP actions, we want to preserve scroll position
      await onRsvp(event.id, status);
    }
  };

  const cardContent = (
    <Card className={`overflow-hidden h-full flex flex-col group hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out ${className} rounded-xl shadow-md border-gray-200`}>
      <div className="relative">
        <LineupImage
          src={eventImage}
          alt={event.title}
          aspectRatio="video"
          overlayVariant="ocean"
          className={compact ? "h-32" : (isMobile ? "h-40" : "h-48")}
        />
        {showCategory && event.event_category && (
          <div className="absolute top-3 left-3 z-30">
            <CategoryPill 
              category={event.event_category} 
              active={true}
              noBorder={true}
              size={isMobile ? "xs" : "sm"}
            />
          </div>
        )}
      </div>
      
      <CardContent className={`${compact ? 'p-3' : (isMobile ? 'p-4' : 'p-5')} flex-1 flex flex-col items-start text-left gap-3`}>
        {/* Title */}
        <h3 className={`font-inter font-semibold text-gray-900 group-hover:text-primary transition-colors ${compact ? 'text-base' : (isMobile ? 'text-lg' : 'text-xl')} line-clamp-2 text-left w-full leading-tight`}>
          {event.title}
        </h3>
        
        <div className="flex flex-col gap-3 w-full flex-1">
          {/* Date & Time */}
          {event.start_date && (
            <div className={`flex items-center text-gray-600 gap-2 w-full text-left ${compact ? 'text-xs' : (isMobile ? 'text-sm' : 'text-sm')}`}>
              <Calendar className={`flex-shrink-0 text-gray-400 ${compact ? 'h-4 w-4' : (isMobile ? 'h-4 w-4' : 'h-4 w-4')}`} />
              <span className="font-inter font-medium">
                {formatEventCardDateTime(event.start_date, event.start_time)}
              </span>
            </div>
          )}

          {/* Location */}
          {(event.venues?.name || event.location) && (
            <div className={`flex items-center text-gray-600 gap-2 w-full text-left ${compact ? 'text-xs' : (isMobile ? 'text-sm' : 'text-sm')}`}>
              <MapPin className={`flex-shrink-0 text-gray-400 ${compact ? 'h-4 w-4' : (isMobile ? 'h-4 w-4' : 'h-4 w-4')}`} />
              <span className={`truncate font-inter`}>
                {event.venues?.name || event.location}
              </span>
            </div>
          )}
        </div>

        {/* RSVP Buttons */}
        {showRsvpButtons && onRsvp && (
          <div className="mt-auto pt-3 flex gap-2 w-full">
            <button
              onClick={(e) => handleRsvpClick(e, 'Going')}
              disabled={loadingEventId === event.id}
              className={`flex-1 px-3 py-2 ${isMobile ? 'text-xs' : 'text-sm'} font-inter font-semibold rounded-lg transition-colors ${
                event.rsvp_status === 'Going'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white border border-gray-200'
              }`}
            >
              Going
            </button>
            <button
              onClick={(e) => handleRsvpClick(e, 'Interested')}
              disabled={loadingEventId === event.id}
              className={`flex-1 px-3 py-2 ${isMobile ? 'text-xs' : 'text-sm'} font-inter font-semibold rounded-lg transition-colors ${
                event.rsvp_status === 'Interested'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-200'
              }`}
            >
              Interested
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <div onClick={handleClick} className="cursor-pointer h-full">
        {cardContent}
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer h-full">
      {cardContent}
    </div>
  );
};
