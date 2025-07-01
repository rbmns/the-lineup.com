
import React from 'react';
import { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import EventShareButton from './EventShareButton';
import { cn } from '@/lib/utils';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { Calendar } from 'lucide-react';
import { LineupImage } from '@/components/ui/lineup-image';

interface EventDetailHeaderProps {
  event: Event;
  coverImage?: string | null;
  image?: string | null;
  eventType?: string;
  onClose?: () => void;
  shareUrl?: string;
  title?: string;
  onEventTypeClick?: () => void;
  startTime?: string;
  showTitleOverlay?: boolean;
  dateTimeInfo?: string;
}

export const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ 
  event,
  coverImage: providedCoverImage,
  image,
  eventType,
  onClose,
  shareUrl,
  title,
  onEventTypeClick,
  startTime,
  showTitleOverlay,
  dateTimeInfo
}) => {
  const { getEventImageUrl } = useEventImages();
  
  // Use provided coverImage or image prop or get from hook
  const imageUrl = providedCoverImage || image || getEventImageUrl(event);
  
  // Debug the dateTimeInfo being passed
  console.log(`[DEBUG] EventDetailHeader - Event ID: ${event.id}`);
  console.log(`[DEBUG] EventDetailHeader - dateTimeInfo: ${dateTimeInfo}`);
  console.log(`[DEBUG] EventDetailHeader - showTitleOverlay: ${showTitleOverlay}`);
  
  return (
    <div className="relative w-full">
      <LineupImage
        src={imageUrl}
        alt={title || event.title}
        aspectRatio="hero"
        treatment="warm-filter"
        overlayVariant="sunset"
        className="rounded-t-lg"
        loading="eager"
      />
      
      {/* Event type badge - Always visible in top left */}
      {eventType && (
        <div className="absolute top-4 left-4 z-30">
          <CategoryPill 
            category={eventType}
            size="sm"
            showIcon={true}
          />
        </div>
      )}
      
      {/* Title + date overlay (desktop/tablet only, NOT mobile) */}
      {showTitleOverlay && (
        <div className="absolute bottom-0 left-0 p-6 text-white z-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title || event.title}</h1>
          {dateTimeInfo && (
            <div className="flex items-center gap-2 text-white/90 text-base font-medium">
              <Calendar className="h-5 w-5" />
              <span>{dateTimeInfo}</span>
            </div>
          )}
          {(event.organiser_name || eventType) && (
            <p className="text-base md:text-lg opacity-90">
              {event.organiser_name ? `By ${event.organiser_name}` : ''}
            </p>
          )}
        </div>
      )}
      
      {/* Share button - Improved visibility with better styling */}
      <div className="absolute bottom-4 right-4 z-30">
        <EventShareButton 
          event={event} 
          variant="secondary"
          className="bg-white/90 hover:bg-white text-gray-900 shadow-lg border border-gray-200 backdrop-blur-sm"
        />
      </div>
    </div>
  );
};
