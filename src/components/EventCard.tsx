
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
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  className = '',
  showCategory = true 
}) => {
  const { getEventImageUrl } = useEventImages();

  const eventImage = event.image_urls && event.image_urls.length > 0 
    ? event.image_urls[0] 
    : getEventImageUrl(event);

  return (
    <Link to={`/events/${event.id}`} className={`block h-full ${className}`}>
      <div className="card-coastal overflow-hidden h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <div className="relative">
          <LineupImage
            src={eventImage}
            alt={event.title}
            aspectRatio="video"
            overlayVariant="ocean"
            className="h-48"
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
        
        <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
          <h3 className="font-semibold mb-3 line-clamp-2 text-ocean-deep group-hover:text-seafoam-green transition-colors">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-sm text-clay-earth">
            {event.start_date && (
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>
                  {formatDate(event.start_date)}
                  {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
                </span>
              </div>
            )}
            
            {(event.venues?.name || event.location) && (
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {event.venues?.name || event.location}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Link>
  );
};
