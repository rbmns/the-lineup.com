
import React from 'react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';

interface EventImageHeaderProps {
  event: Event;
  className?: string;
}

export const EventImageHeader: React.FC<EventImageHeaderProps> = ({ 
  event, 
  className 
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  return (
    <div className={cn("relative w-full h-64 md:h-80 overflow-hidden", className)}>
      <img
        src={imageUrl}
        alt={event.title || "Event image"}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('default')) {
            console.log('Image failed to load, using default');
            target.src = "https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg";
          }
        }}
      />
      <div className="absolute inset-0 bg-black/20"></div>
      
      {event.event_category && (
        <div className="absolute top-4 left-4 z-10">
          <CategoryPill 
            category={event.event_category}
            size="default"
          />
        </div>
      )}
    </div>
  );
};
