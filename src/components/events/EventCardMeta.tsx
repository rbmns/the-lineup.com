
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

// Amsterdam/Netherlands timezone
const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

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
  
  // Format time for display in Amsterdam timezone with 24-hour format (remove seconds)
  const formatEventTime = (event: any): string => {
    try {
      if (!event.start_time) return 'Time not specified';
      
      // If start_time is already a full ISO datetime string
      if (event.start_time.includes('T')) {
        const time = new Date(event.start_time);
        return formatInTimeZone(time, AMSTERDAM_TIMEZONE, "HH:mm");
      }
      
      // If start_time is just a time string (HH:MM:SS)
      const timeparts = event.start_time.split(':');
      return `${timeparts[0]}:${timeparts[1]}`; // Only keep hours and minutes
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time not specified';
    }
  };

  return (
    <>
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className="font-inter leading-7 text-sm">
          {formatEventDate(event)} at {formatEventTime(event)}
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
