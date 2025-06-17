
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE, formatTime } from '@/utils/date-formatting';
import { cn } from '@/lib/utils';

interface EventCardMetaProps {
  event: { 
    start_date?: string | null;
    start_time?: string | null;
    venues?: { 
      name: string;
      city?: string;
      street?: string;
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
  // Format date for display in Amsterdam timezone
  const formatEventDate = (event: any): string => {
    try {
      if (!event.start_date) return 'Date not specified';
      
      const date = new Date(event.start_date);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "d MMM yyyy");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not specified';
    }
  };
  
  // Format time using the 24-hour time format (remove seconds)
  const getEventTimeDisplay = (event: any): string => {
    if (!event.start_time) return 'Time not specified';
    return formatTime(event.start_time);
  };

  // Get venue display name with proper fallback logic
  const getVenueDisplay = (): string => {
    // First priority: venue name from venues table
    if (event.venues?.name) {
      return event.venues.name;
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
          {formatEventDate(event)} at {getEventTimeDisplay(event)}
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
