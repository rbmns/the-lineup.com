
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatEventDateForCard, formatEventTime } from '@/utils/timezone-utils';
import { cn } from '@/lib/utils';

interface EventCardMetaProps {
  event: { 
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
  
  // Format date and time for display
  const formatEventDisplay = (event: any): { date: string; time: string } => {
    try {
      if (!event.start_datetime) {
        return { date: 'Date TBD', time: 'Time TBD' };
      }
      
      const startDate = new Date(event.start_datetime);
      const endDate = event.end_datetime ? new Date(event.end_datetime) : null;
      
      // Check if it's a multi-day event
      const isMultiDay = endDate && 
        startDate.toDateString() !== endDate.toDateString();
      
      let dateDisplay = '';
      let timeDisplay = '';
      
      if (isMultiDay) {
        // Multi-day event: show date range
        const startFormatted = formatEventDateForCard(event.start_datetime, eventTimezone);
        const endFormatted = formatEventDateForCard(event.end_datetime, eventTimezone);
        dateDisplay = `${startFormatted} - ${endFormatted}`;
        
        // Show start time
        timeDisplay = formatEventTime(event.start_datetime, eventTimezone);
      } else {
        // Single day event
        dateDisplay = formatEventDateForCard(event.start_datetime, eventTimezone);
        
        // Show time range
        const startTime = formatEventTime(event.start_datetime, eventTimezone);
        if (endDate) {
          const endTime = formatEventTime(event.end_datetime, eventTimezone);
          timeDisplay = `${startTime} - ${endTime}`;
        } else {
          timeDisplay = startTime;
        }
      }
      
      return { date: dateDisplay, time: timeDisplay };
    } catch (error) {
      console.error('Error formatting event display:', error);
      return { date: 'Date TBD', time: 'Time TBD' };
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

  const { date, time } = formatEventDisplay(event);
  const textSize = compact ? 'text-xs' : 'text-sm';

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className={cn("font-inter", textSize)}>
          {date}
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className={cn("font-inter", textSize)}>
          {time}
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <MapPin className="h-4 w-4 mr-2" />
        <span className={cn("font-inter", textSize)}>
          {getVenueDisplay()}
        </span>
      </div>
    </div>
  );
};
