
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatEventDateForCard, formatEventTime } from '@/utils/timezone-utils';
import { cn } from '@/lib/utils';

interface EventCardMetaProps {
  event: { 
    start_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    timezone?: string;
    venues?: { 
      name: string;
      city?: string;
      street?: string;
      country?: string;
    } | null;
    location?: string;
  };
  compact?: boolean;
  className?: string;
}

export const EventCardMeta: React.FC<EventCardMetaProps> = ({ 
  event, 
  compact = false,
  className 
}) => {
  const eventTimezone = event.timezone || 'Europe/Amsterdam';
  
  // Format date in event's local timezone (no year for cards)
  const formatEventDateDisplay = (event: any): string => {
    try {
      if (!event.start_date) return 'Date not specified';
      
      return formatEventDateForCard(event.start_date, eventTimezone);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not specified';
    }
  };
  
  // Format time range in event's local timezone (no location label for cards)
  const getEventTimeDisplay = (event: any): string => {
    if (!event.start_date) return 'Time not specified';
    
    try {
      if (!event.start_time) return 'Time not specified';
      
      const startTime = formatEventTime(event.start_date, event.start_time, eventTimezone);
      
      if (!event.end_time) {
        return startTime;
      }
      
      const endTime = formatEventTime(event.start_date, event.end_time, eventTimezone);
      return `${startTime} – ${endTime}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return event.start_time ? event.start_time.substring(0, 5) : 'Time not specified';
    }
  };

  // Get venue display name with proper fallback logic
  const getVenueDisplay = (): string => {
    // First priority: venue name from venues table
    if (event.venues?.name) {
      let display = event.venues.name;
      
      // Add city if available and different from venue name
      if (event.venues.city && !event.venues.name.toLowerCase().includes(event.venues.city.toLowerCase())) {
        display += `, ${event.venues.city}`;
      }
      
      return display;
    }
    
    // Second priority: location field (legacy)
    if (event.location) {
      return event.location;
    }
    
    // Fallback
    return 'Location TBD';
  };

  const textSize = compact ? 'text-xs' : 'text-sm';

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className={cn("font-inter leading-7", textSize)}>
          {formatEventDateDisplay(event)}
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className={cn("font-inter leading-7", textSize)}>
          {getEventTimeDisplay(event)}
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <MapPin className="h-4 w-4 mr-2" />
        <span className={cn("font-inter leading-7", textSize)}>
          {getVenueDisplay()}
        </span>
      </div>
    </div>
  );
};
