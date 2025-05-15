
import React from 'react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';

interface EventCardHeaderProps {
  event: Event;
  compact?: boolean;
}

export const EventCardHeader: React.FC<EventCardHeaderProps> = ({ 
  event, 
  compact = false 
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  return (
    <div className="relative">
      <div className={cn(
        "relative w-full overflow-hidden", 
        compact ? "h-28" : "h-40",
        "bg-gray-200"
      )}>
        <img
          src={imageUrl}
          alt={event.title || "Event image"}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Handle image load errors by setting a default
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('default')) {
              console.log('Image failed to load, using default');
              target.src = "https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg";
            }
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
      </div>
      
      {event.event_type && (
        <div className="absolute top-3 left-3">
          <CategoryPill 
            category={event.event_type}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};
