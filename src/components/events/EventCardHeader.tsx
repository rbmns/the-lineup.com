
import React from 'react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { LineupImage } from '@/components/ui/lineup-image';

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
      <LineupImage
        src={imageUrl}
        alt={event.title || "Event image"}
        aspectRatio="video"
        overlayVariant="ocean"
        className={cn(compact && "h-28")}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('/img/default.jpg')) {
            console.log('Image failed to load, using default');
            target.src = "/img/default.jpg";
          }
        }}
      />
      
      {event.event_category && (
        <div className="absolute top-3 left-3 z-30">
          <CategoryPill 
            category={event.event_category}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};
