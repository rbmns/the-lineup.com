
import React, { useState } from 'react';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { LineupImage } from '@/components/ui/lineup-image';
import { EventCardMeta } from '@/components/events/EventCardMeta';
import { EventCardDescription } from '@/components/events/EventCardDescription';
import { EventCardActions } from '@/components/events/EventCardActions';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  compact?: boolean;
  className?: string;
  loadingEventId?: string | null;
  onClick?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onRsvp,
  showRsvpButtons = true,
  compact = false,
  className,
  loadingEventId,
  onClick
}) => {
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    } else {
      // Dispatch event for overlay handling
      const customEvent = new CustomEvent('eventCardClicked', {
        detail: { eventId: event.id }
      });
      window.dispatchEvent(customEvent);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Enhanced fallback image logic
  const getEventImage = () => {
    if (!imageError && event.image_urls?.[0]) {
      return event.image_urls[0];
    }
    
    // Use category-specific fallback images from the GitHub repository
    const categoryImageMap: { [key: string]: string } = {
      'music': 'music.jpg',
      'sport': 'sports.jpg',
      'sports': 'sports.jpg',
      'yoga': 'yoga.jpg',
      'surf': 'surf.jpg',
      'beach': 'beach.jpg',
      'food': 'food.jpg',
      'culture': 'culture.jpg',
      'festival': 'festival.jpg',
      'game': 'game.jpg',
      'kite': 'kite.jpg',
      'party': 'beachparty.jpg',
      'community': 'festival.jpg',
      'market': 'shopping.jpg'
    };

    const categoryKey = event.event_category?.toLowerCase() || 'default';
    const fallbackImage = categoryImageMap[categoryKey] || 'default.jpg';
    
    return `https://raw.githubusercontent.com/rbmns/images/main/lineup/${fallbackImage}`;
  };

  const eventLocation = event.venues?.name ? 
    `${event.venues.name}${event.venues.city ? `, ${event.venues.city}` : ''}` : 
    event.location || 'Location TBD';

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer h-full flex flex-col",
        "bg-white border border-sand hover:border-seafoam-green",
        "w-full max-w-full", // Ensure card doesn't exceed container width
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden w-full flex-shrink-0",
        compact ? "h-32" : "h-40 sm:h-48" // Responsive height
      )}>
        <LineupImage
          src={getEventImage()}
          alt={event.title}
          aspectRatio="video"
          overlayVariant="ocean"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        
        {/* Category Pill */}
        {event.event_category && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <CategoryPill 
              category={event.event_category} 
              size={compact ? "sm" : "default"}
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className={cn(
        "flex-1 flex flex-col w-full min-w-0", // min-w-0 prevents overflow
        compact ? "p-2 sm:p-3" : "p-3 sm:p-4" // Responsive padding
      )}>
        {/* Title */}
        <h3 className={cn(
          "font-semibold text-ocean-deep line-clamp-2 mb-2 group-hover:text-seafoam-green transition-colors",
          "break-words", // Allow word breaking for long titles
          compact ? "text-sm" : "text-sm sm:text-base" // Responsive text size
        )}>
          {event.title}
        </h3>

        {/* Meta Information */}
        <EventCardMeta 
          event={event} 
          compact={compact}
          className="mb-3"
        />

        {/* Description - Hidden by component update */}
        <EventCardDescription 
          description={event.description}
          compact={compact}
          className="mb-4 flex-1"
        />

        {/* Actions */}
        {showRsvpButtons && isAuthenticated && (
          <EventCardActions
            eventId={event.id}
            currentRsvpStatus={event.rsvp_status}
            onRsvp={onRsvp}
            isLoading={loadingEventId === event.id}
            compact={compact}
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking RSVP buttons
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
