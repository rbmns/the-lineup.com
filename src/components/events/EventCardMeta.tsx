
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatEventDateTime, getUserTimezone } from '@/utils/timezone-utils';
import { cn } from '@/lib/utils';

interface EventCardMetaProps {
  event: { 
    start_datetime?: string;
    start_date?: string | null;
    start_time?: string | null;
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
  const viewerTimezone = getUserTimezone();
  
  // Use unified datetime formatting
  const { date, time } = formatEventDateTime({
    start_datetime: event.start_datetime,
    start_date: event.start_date || undefined,
    start_time: event.start_time || undefined,
    timezone: event.timezone
  }, viewerTimezone);

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
          {date} at {time}
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
