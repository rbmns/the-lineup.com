
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { LineupImage } from '@/components/ui/lineup-image';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
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

  const eventImage = event.image_urls && event.image_urls.length > 0 
    ? event.image_urls[0] 
    : getEventImageUrl(event);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(event);
    }
  };

  const cardContent = (
    <div className={`card-coastal overflow-hidden h-full flex flex-col group hover:scale-105 transition-all duration-300 ${className}`}>
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
            />
          </div>
        )}
      </div>
      
      <CardContent className={`${compact ? 'p-3' : 'p-4 sm:p-5'} flex-1 flex flex-col`}>
        <h3 className={`font-semibold mb-3 line-clamp-2 text-ocean-deep group-hover:text-seafoam-green transition-colors ${compact ? 'text-sm' : ''}`}>
          {event.title}
        </h3>
        
        <div className={`space-y-2 text-clay-earth ${compact ? 'text-xs' : 'text-sm'}`}>
          {event.start_date && (
            <div className="flex items-center">
              <Calendar className={`mr-2 flex-shrink-0 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span>
                {formatDate(event.start_date)}
                {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
              </span>
            </div>
          )}
          
          {(event.venues?.name || event.location) && (
            <div className="flex items-center">
              <MapPin className={`mr-2 flex-shrink-0 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className="line-clamp-1">
                {event.venues?.name || event.location}
              </span>
            </div>
          )}
        </div>

        {/* RSVP Buttons - only show if authenticated and enabled */}
        {showRsvpButtons && onRsvp && (
          <div className="mt-auto pt-3">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRsvp(event.id, 'Going');
                }}
                disabled={loadingEventId === event.id}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
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
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  event.rsvp_status === 'Interested'
                    ? 'bg-sky-blue text-white'
                    : 'bg-sand text-ocean-deep hover:bg-sky-blue hover:text-white'
                }`}
              >
                Interested
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
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
