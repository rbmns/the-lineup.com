
import React from 'react';
import { EventTypeIcon } from "@/components/ui/EventTypeIcon";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventShareButton } from './EventShareButton';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { formatInTimeZone } from 'date-fns-tz';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventDetailHeaderProps {
  image?: string | null;
  eventType: string;
  onClose: () => void;
  shareUrl: string;
  title: string;
  description?: string;
  tags?: string[];
  onEventTypeClick?: () => void;
  event?: any; // Add event prop for SEO-friendly sharing
  startTime?: string;
  showTitleOverlay?: boolean;
}

export const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({
  image,
  eventType,
  onClose,
  shareUrl,
  title,
  description,
  tags,
  onEventTypeClick,
  event,
  startTime,
  showTitleOverlay = true
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageToUse = image || (event ? getEventImageUrl(event) : "https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg");
  const isMobile = useIsMobile();
  
  // Format the date if provided - using Amsterdam timezone
  const formattedDate = startTime ? formatInTimeZone(
    new Date(startTime), 
    'Europe/Amsterdam', 
    "EEE, d MMM yyyy • HH:mm"
  ) : null;
  
  return (
    <div className="relative animate-fade-in">
      {/* Image */}
      <div className="relative w-full bg-gray-100">
        <img
          src={imageToUse}
          alt={title}
          className="w-full aspect-[3/2] md:aspect-[16/9] object-cover transition-all duration-700"
        />
        
        {/* Desktop overlay with title and date - only shown on desktop */}
        {!isMobile && showTitleOverlay && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pt-16 text-white">
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight mb-1">
              {title || 'Untitled Event'}
            </h1>
            {formattedDate && (
              <div className="flex items-center gap-1 text-sm md:text-base text-gray-100">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
                {event?.recurring_count && event.recurring_count > 0 && (
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded text-white">
                    +{event.recurring_count} more dates
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Overlay controls */}
        <div className="absolute top-4 right-4 flex gap-2 animate-fade-in">
          <EventShareButton 
            title={title}
            url={shareUrl}
            description="" // Skip description for better social sharing
            event={event} // Pass the event object for SEO-friendly URLs
          />
        </div>
        
        {/* Event type badge */}
        <div className="absolute top-4 left-4 animate-fade-in">
          <CategoryPill
            category={eventType}
            onClick={onEventTypeClick}
            showIcon={true}
            size="default"
            className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          />
        </div>
      </div>
    </div>
  );
};
