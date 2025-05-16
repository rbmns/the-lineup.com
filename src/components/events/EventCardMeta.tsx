
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE, formatTime } from '@/utils/date-formatting';

interface EventCardMetaProps {
  event: { 
    start_date?: string | null;
    start_time?: string | null;
    venues?: { name: string } | null;
  };
}

export const EventCardMeta: React.FC<EventCardMetaProps> = ({ event }) => {
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

  return (
    <>
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className="font-inter leading-7 text-sm">
          {formatEventDate(event)} at {getEventTimeDisplay(event)}
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="font-inter leading-7 text-sm">
          {event.venues?.name || 'No Venue'}
        </span>
      </div>
    </>
  );
};
