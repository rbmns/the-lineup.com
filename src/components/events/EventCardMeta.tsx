
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatEventDateForCard, formatEventTime } from '@/utils/timezone-utils';
import { cn } from '@/lib/utils';

interface EventCardMetaProps {
  event: { 
    start_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    start_datetime?: string | null;
    end_datetime?: string | null;
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
      // Use timestampz field first, fallback to legacy fields
      if (event.start_datetime) {
        return formatEventDateForCard(event.start_datetime, eventTimezone);
      }
      
      if (event.start_date) {
        return formatEventDateForCard(event.start_date, eventTimezone);
      }
      
      return 'Date not specified';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not specified';
    }
  };
  
  // Format time range in event's local timezone (no location label for cards)
  const getEventTimeDisplay = (event: any): string => {
    try {
      // Use timestampz field first
      if (event.start_datetime) {
        const startTime = formatEventTime(event.start_datetime, eventTimezone);
        
        if (!event.end_datetime) {
          return startTime;
        }
        
        const endTime = formatEventTime(event.end_datetime, eventTimezone);
        return `${startTime} – ${endTime}`;
      }
      
      // Fallback to legacy fields
      if (!event.start_date || !event.start_time) return 'Time not specified';
      
      const startTimeFormatted = formatEventTime(`${event.start_date}T${event.start_time}`, eventTimezone);
      
      if (!event.end_time) {
        return startTimeFormatted;
      }
      
      const endTimeFormatted = formatEventTime(`${event.start_date}T${event.end_time}`, eventTimezone);
      return `${startTimeFormatted} – ${endTimeFormatted}`;
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
