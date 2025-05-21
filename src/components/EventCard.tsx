
import React from 'react';
import { Event } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Star } from 'lucide-react';
import { CategoryPill } from '@/components/ui/category-pill';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface EventCardProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  compact?: boolean;
  className?: string;
  loadingEventId?: string | null;
  onClick?: (event: Event) => void;
}

const EventCard = ({
  event,
  onRsvp,
  showRsvpButtons = true,
  compact = false,
  className,
  loadingEventId,
  onClick
}: EventCardProps) => {
  const { isAuthenticated } = useAuth();
  const isLoading = loadingEventId === event.id;
  
  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (!onRsvp) return;
    
    try {
      await onRsvp(event.id, status);
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
    }
  };
  
  const truncateDescription = (description: string, maxLength = 100) => {
    if (!description || description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };
  
  const formatEventDate = (startDate?: string | null, endDate?: string | null) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const formattedStart = start.toLocaleDateString('en-US', options);
    
    if (endDate) {
      const end = new Date(endDate);
      const formattedEnd = end.toLocaleDateString('en-US', options);
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    return formattedStart;
  };

  // Handler for card click
  const handleCardClick = () => {
    if (onClick && event) {
      onClick(event);
    }
  };
  
  return (
    <div className={cn(
      "border rounded-lg shadow-sm overflow-hidden flex flex-col bg-white h-full",
      className
    )}>
      <Link to={`/events/${event.id}`} className="block flex-shrink-0">
        <div className="relative w-full pt-[56.25%] bg-gray-100 overflow-hidden">
          {event.image_urls && event.image_urls.length > 0 && (
            <img 
              src={event.image_urls[0]} 
              alt={event.title || 'Event'} 
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          )}
          
          {event.event_type && (
            <div className="absolute top-3 left-3">
              <CategoryPill 
                category={event.event_type} 
                size="sm" 
                showIcon={true}
                forceActive={true} // Always use active style for cards
              />
            </div>
          )}
        </div>
      </Link>
      
      <div className={cn(
        "flex flex-col flex-grow p-4", 
        compact ? "space-y-2" : "space-y-3"
      )}>
        <Link to={`/events/${event.id}`} className="block">
          <h3 className={cn(
            "font-medium text-gray-900 hover:text-blue-600 transition-colors",
            compact ? "text-lg" : "text-xl"
          )}>
            {event.title}
          </h3>
        </Link>
        
        {!compact && event.description && (
          <p className="text-sm text-gray-600">{truncateDescription(event.description)}</p>
        )}
        
        <div className={cn(
          "flex flex-col", 
          compact ? "space-y-1" : "space-y-2"
        )}>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{formatEventDate(event.start_date)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{event.location}</span>
            </div>
          )}
          
          {event.start_time && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
            </div>
          )}
        </div>
        
        {showRsvpButtons && isAuthenticated && (
          <div className={cn(
            "flex items-center gap-2 mt-auto pt-2",
            isLoading ? "opacity-70 pointer-events-none" : ""
          )}>
            <Button 
              variant="default" 
              className="flex-grow px-2"
              onClick={() => handleRsvp('Going')}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading
                </span>
              ) : "Going"}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={() => handleRsvp('Interested')}
              disabled={isLoading}
            >
              <Star className="h-4 w-4" />
              <span className="sr-only">Interested</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
