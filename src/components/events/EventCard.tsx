
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users } from 'lucide-react';
import { EventCardActions } from './EventCardActions';
import { formatEventTime } from '@/utils/dateUtils';
import { formatDate } from '@/utils/date-formatting';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  showRsvpButtons?: boolean;
  isLoading?: boolean;
  compact?: boolean;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onRsvp,
  showRsvpButtons = false,
  isLoading = false,
  compact = false,
  className
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on RSVP buttons or other interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-navigation="true"]') || target.closest('button')) {
      return;
    }
    navigate(`/events/${event.id}`);
  };

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (onRsvp) {
      await onRsvp(eventId, status);
    }
    return true;
  };

  // Handle image_urls - it could be a string or array
  const getImageUrl = (): string => {
    if (!event.image_urls) {
      return getDefaultImage();
    }

    // Handle array case
    if (Array.isArray(event.image_urls)) {
      const firstValidUrl = event.image_urls.find(url => 
        typeof url === 'string' && url.trim().length > 0
      );
      if (firstValidUrl) {
        return firstValidUrl;
      }
      return getDefaultImage();
    }

    // Handle string case
    if (typeof event.image_urls === 'string') {
      const urlString = event.image_urls.trim();
      
      // Check if it's a JSON array string
      if (urlString.startsWith('[') && urlString.endsWith(']')) {
        try {
          const parsed = JSON.parse(urlString);
          if (Array.isArray(parsed)) {
            const firstValidUrl = parsed.find(url => 
              typeof url === 'string' && url.trim().length > 0
            );
            if (firstValidUrl) {
              return firstValidUrl;
            }
          }
        } catch (e) {
          console.warn('Failed to parse image_urls JSON:', urlString);
        }
      } else if (urlString.length > 0) {
        // Treat as a single URL
        return urlString;
      }
    }
    
    return getDefaultImage();
  };

  const getDefaultImage = (): string => {
    // Use fallback image based on category
    const categoryImages: Record<string, string> = {
      'music': '/img/categories/music.jpg',
      'arts': '/img/categories/arts.jpg',
      'food': '/img/categories/food.jpg',
      'sports': '/img/categories/sports.jpg',
      'nightlife': '/img/categories/nightlife.jpg',
      'wellness': '/img/categories/wellness.jpg',
      'tech': '/img/categories/tech.jpg',
      'business': '/img/categories/business.jpg',
      'community': '/img/categories/community.jpg',
      'other': '/img/default.jpg'
    };
    
    return categoryImages[event.event_category || 'other'] || '/img/default.jpg';
  };

  const imageUrl = getImageUrl();

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 h-full",
        isLoading && "opacity-50",
        className
      )}
      onClick={handleCardClick}
      data-event-id={event.id}
    >
      <CardContent className="p-4 h-full flex flex-col">
        {/* Event Image */}
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-32 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('/img/default.jpg')) {
                console.log('Image failed to load, using default');
                target.src = "/img/default.jpg";
              }
            }}
          />
        </div>

        {/* Event Details */}
        <div className="flex-1 space-y-3">
          {/* Title and Vibe */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            {event.vibe && (
              <Badge variant="secondary" className="text-xs">
                {event.vibe}
              </Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(event.start_date)}</span>
            {event.start_time && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{formatEventTime(event.start_time)}</span>
              </>
            )}
          </div>

          {/* Location */}
          {event.destination && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.destination}</span>
            </div>
          )}

          {/* Description */}
          {event.description && !compact && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* RSVP Actions */}
        {showRsvpButtons && (
          <EventCardActions
            eventId={event.id}
            currentRsvpStatus={event.rsvp_status}
            showRsvpButtons={true}
            onRsvp={handleRsvp}
            isLoading={isLoading}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </CardContent>
    </Card>
  );
};
