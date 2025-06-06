
import React from 'react';
import { Event } from '@/types';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { Calendar } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { LineupImage } from '@/components/ui/lineup-image';

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
      <LineupImage
        src={imageUrl}
        alt={event.title || "Event"}
        aspectRatio="hero"
        overlayVariant="ocean"
        overlayText={formattedDate || undefined}
        overlayPosition="bottom-left"
        overlayTextVariant="white-text"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('/img/default.jpg')) {
            console.log('Event image failed to load, using default');
            target.src = "/img/default.jpg";
          }
        }}
      />
      
      {/* Event category badge */}
      {event.event_category && (
        <div className="absolute top-4 left-4 z-30">
          <CategoryPill 
            category={event.event_category}
            size="sm"
          />
        </div>
      )}
      
      {/* Recurring events indicator */}
      {event.recurring_count && event.recurring_count > 0 && (
        <div className="absolute top-4 right-4 z-30">
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded text-white backdrop-blur-sm">
            +{event.recurring_count} more dates
          </span>
        </div>
      )}
    </div>
  );
};
