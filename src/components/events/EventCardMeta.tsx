
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { getEventDateTime } from '@/utils/dateUtils';

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
  // Format datetime for display in Amsterdam timezone with 24-hour format
  const formatDateTime = (event: any): string => {
    try {
      const dateTimeStr = getEventDateTime(event);
      if (!dateTimeStr) return 'Date and time not specified';
      
      const date = new Date(dateTimeStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "d MMM yyyy 'at' HH:mm");
    } catch (error) {
      console.error('Error formatting date and time:', error);
      return 'Date and time not specified';
    }
  };

  return (
    <>
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className="font-inter leading-7 text-sm">
          {formatDateTime(event)}
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
