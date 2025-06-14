import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { LineupImage } from '@/components/ui/lineup-image';
import { MapPin, Calendar } from 'lucide-react';
import { formatDate, formatEventTime, formatEventCardDateTime } from '@/utils/date-formatting';
import { useEventImages } from '@/hooks/useEventImages';
import { Event } from '@/types';

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

  const eventImage = getEventImageUrl(event);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(event);
    }
  };

  const cardContent = (
    <Card className={`overflow-hidden h-full flex flex-col group hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out ${className} rounded-xl shadow-md`}>
      <div className="relative">
        <LineupImage
          src={eventImage}
          alt={event.title}
          aspectRatio="video"
          overlayVariant="ocean"
          className={compact ? "h-32" : "h-48"}
        />
        {showCategory && event.event_category && (
          <div className="absolute top-3 left-3 z-30">
            <CategoryPill 
              category={event.event_category} 
              active={true}
              noBorder={true}
              size="sm"
            />
          </div>
        )}
      </div>
      
      <CardContent className={`${compact ? 'p-3' : 'p-4'} flex-1 flex flex-col items-start text-left font-inter gap-2`}>
        {/* Title */}
        <h3 className={`font-semibold text-ocean-deep group-hover:text-seafoam-green transition-colors ${compact ? 'text-base' : 'text-lg'} line-clamp-2 text-left w-full font-inter`}>
          {event.title}
        </h3>
        
        <div className="flex flex-col gap-2 w-full">
          {/* Date & Time */}
          {event.start_date && (
            <div className={`flex items-center text-ocean-deep-700 font-medium gap-2 w-full text-left font-inter ${compact ? 'text-xs' : 'text-sm'}`}>
              <Calendar className={`flex-shrink-0 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              <span className="font-medium">
                {formatEventCardDateTime(event.start_date, event.start_time)}
              </span>
            </div>
          )}

          {/* Location */}
          {(event.venues?.name || event.location) && (
            <div className={`flex items-center text-ocean-deep-600 gap-2 w-full text-left font-inter ${compact ? 'text-xs' : 'text-sm'}`}>
              <MapPin className={`flex-shrink-0 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              <span className={`truncate font-normal`}>
                {event.venues?.name || event.location}
              </span>
            </div>
          )}
        </div>

        {/* RSVP Buttons */}
        {showRsvpButtons && onRsvp && (
          <div className="mt-auto pt-2 flex gap-2 w-full">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRsvp(event.id, 'Going');
              }}
              disabled={loadingEventId === event.id}
              className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-inter ${
                event.rsvp_status === 'Going'
                  ? 'bg-seafoam-green text-white'
                  : 'bg-sand text-ocean-deep hover:bg-seafoam-green hover:text-white'
              }`}
            >
              Going
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRsvp(event.id, 'Interested');
              }}
              disabled={loadingEventId === event.id}
              className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors font-inter ${
                event.rsvp_status === 'Interested'
                  ? 'bg-sky-blue text-white'
                  : 'bg-sand text-ocean-deep hover:bg-sky-blue hover:text-white'
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
    <Link to={`/events/${event.id}`} className="block h-full">
      {cardContent}
    </Link>
  );
};
