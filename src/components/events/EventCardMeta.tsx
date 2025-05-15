
import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

// Amsterdam/Netherlands timezone
const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

interface EventCardMetaProps {
  startTime: string | null;
  venueName: string | null;
}

export const EventCardMeta: React.FC<EventCardMetaProps> = ({ 
  startTime, 
  venueName 
}) => {
  // Format datetime for display in Amsterdam timezone with 24-hour format
  const formatDateTime = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "d MMM yyyy 'at' HH:mm");
    } catch (error) {
      console.error('Error formatting date and time:', error);
      return dateStr;
    }
  };

  return (
    <>
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span className="font-inter leading-7 text-sm">
          {startTime && formatDateTime(startTime)}
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="font-inter leading-7 text-sm">
          {venueName || 'No Venue'}
        </span>
      </div>
    </>
  );
};
