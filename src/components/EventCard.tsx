
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
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    } else {
      // Navigate to full-page event detail
      navigate(`/events/${event.id}`);
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
        "w-full max-w-full min-w-0", // Ensure card fits container and handles overflow
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image Section - Consistent sizing */}
      <div className={cn(
        "relative overflow-hidden w-full flex-shrink-0",
        compact ? "h-32" : "h-48" // Fixed height for consistency
      )}>
        <LineupImage
          src={getEventImage()}
          alt={event.title}
          aspectRatio="video"
          overlayVariant="ocean"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        
        {/* Category Pill - Better mobile positioning */}
        {event.event_category && (
          <div className="absolute top-2 left-2">
            <CategoryPill 
              category={event.event_category} 
              size={compact ? "sm" : "default"}
            />
          </div>
        )}
      </div>

      {/* Content Section - Flex layout for consistent heights */}
      <CardContent className={cn(
        "flex-1 flex flex-col w-full min-w-0 text-left",
        compact ? "p-3" : "p-3 sm:p-4"
      )}>
        {/* Title - Fixed height with line clamping */}
        <h3 className={cn(
          "font-semibold text-ocean-deep line-clamp-2 mb-2 group-hover:text-seafoam-green transition-colors text-left",
          "break-words hyphens-auto overflow-wrap-anywhere min-h-[2.5rem]", // Fixed minimum height
          compact ? "text-sm leading-tight" : "text-sm sm:text-base leading-tight"
        )}>
          {event.title}
        </h3>

        {/* Meta Information - Fixed height */}
        <div className="min-h-[1.25rem] mb-2">
          <EventCardMeta 
            event={event} 
            compact={compact}
            className="text-left"
          />
        </div>

        {/* Description - Flex-grow to fill space */}
        <div className="flex-1 mb-3">
          <EventCardDescription 
            description={event.description}
            compact={compact}
            className="text-left"
          />
        </div>

        {/* Actions - Always at bottom */}
        {showRsvpButtons && isAuthenticated && (
          <div className="mt-auto">
            <EventCardActions
              eventId={event.id}
              currentRsvpStatus={event.rsvp_status}
              onRsvp={onRsvp}
              isLoading={loadingEventId === event.id}
              compact={compact}
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking RSVP buttons
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
