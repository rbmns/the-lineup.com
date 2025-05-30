
import React from 'react';
import { Event } from '@/types';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { Calendar } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

interface EventImageHeaderProps {
  event: Event;
  className?: string;
}

export const EventImageHeader: React.FC<EventImageHeaderProps> = ({ 
  event,
  className = ""
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageUrl = event.image_urls?.[0] || getEventImageUrl(event);
  
  // Format the date for display in the overlay
  const formattedDate = event.start_time ? formatInTimeZone(
    new Date(event.start_time), 
    'Europe/Amsterdam', 
    "EEE, d MMM yyyy • HH:mm"
  ) : null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Image with overlay */}
      <div className="relative w-full aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={event.title || "Event"}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('/img/default.jpg')) {
              console.log('Event image failed to load, using default');
              target.src = "/img/default.jpg";
            }
          }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Date overlay at bottom */}
        {formattedDate && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm md:text-base font-medium">{formattedDate}</span>
              {event.recurring_count && event.recurring_count > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                  +{event.recurring_count} more dates
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Event category badge */}
        {event.event_category && (
          <div className="absolute top-4 left-4">
            <CategoryPill 
              category={event.event_category}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
