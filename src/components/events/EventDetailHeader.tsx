
import React from 'react';
import { Event } from '@/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import EventShareButton from './EventShareButton';
import { cn } from '@/lib/utils';
import { useEventImages } from '@/hooks/useEventImages';

interface EventDetailHeaderProps {
  event: Event;
  coverImage?: string | null;
  image?: string | null; // Added for backward compatibility
  eventType?: string;
  onClose?: () => void;
  shareUrl?: string;
  title?: string;
  onEventTypeClick?: () => void;
  startTime?: string;
  showTitleOverlay?: boolean;
}

export const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ 
  event,
  coverImage: providedCoverImage,
  image, // Added for backward compatibility
  eventType,
  onClose,
  shareUrl,
  title,
  onEventTypeClick,
  startTime,
  showTitleOverlay
}) => {
  const { getEventImageUrl } = useEventImages();
  
  // Use provided coverImage or image prop or get from hook
  const imageUrl = providedCoverImage || image || getEventImageUrl(event);
  
  return (
    <div className="relative">
      <AspectRatio ratio={21/9} className="overflow-hidden rounded-lg bg-gray-100 mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || event.title}
            className="object-cover w-full h-full"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{title || event.title}</h1>
          
          {(event.organiser_name || eventType) && (
            <p className="text-lg opacity-90">
              {eventType ? `${eventType}` : ''}
              {event.organiser_name ? `By ${event.organiser_name}` : ''}
            </p>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <EventShareButton 
            event={event} 
            variant="outline" 
          />
        </div>
      </AspectRatio>
    </div>
  );
};
