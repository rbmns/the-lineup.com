
import React from 'react';
import { Calendar, Clock, RepeatIcon } from 'lucide-react';
import { Event } from '@/types';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE, formatDate, formatTime } from '@/utils/dateUtils';
import { Badge } from '../ui/badge';

interface EventDateTimeInfoProps {
  event: Event;
  className?: string;
  iconClassName?: string;
  showRecurring?: boolean;
  recurringEvents?: Event[];
}

export const EventDateTimeInfo: React.FC<EventDateTimeInfoProps> = ({ 
  event,
  className = "",
  iconClassName = "",
  showRecurring = false,
  recurringEvents = []
}) => {
  // Check if we have valid date information
  if (!event.start_time) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 italic ${className}`}>
        <Calendar className={`h-4 w-4 flex-shrink-0 ${iconClassName}`} />
        <span>Date and time not specified</span>
      </div>
    );
  }
  
  // Format date and time for display in Amsterdam timezone with 24-hour format
  const formatDateStr = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, 'EEEE, d MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatTimeStr = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateString;
    }
  };

  const startDate = formatDateStr(event.start_time);
  const startTime = formatTimeStr(event.start_time);
  const endTime = event.end_time ? formatTimeStr(event.end_time) : null;
  const isMultiDay = event.end_time && formatDateStr(event.start_time) !== formatDateStr(event.end_time);
  const endDate = event.end_time ? formatDateStr(event.end_time) : null;
  
  const isRecurring = recurringEvents && recurringEvents.length > 0;

  return (
    <div className={`flex flex-col gap-2 text-gray-700 ${className}`}>
      {/* Main date display */}
      <div className="flex items-start gap-2">
        <Calendar className={`flex-shrink-0 text-gray-500 mt-1 ${iconClassName}`} />
        <div className="space-y-1">
          <div className="font-medium">{startDate}</div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span>{startTime}</span>
            {endTime && <span>- {endTime}</span>}
          </div>
          
          {/* Show end date if it's different from start date */}
          {isMultiDay && endDate && (
            <div className="text-sm text-gray-600 mt-1">
              Until {endDate}
            </div>
          )}
        </div>
      </div>
      
      {/* Show recurring events if requested and available */}
      {showRecurring && isRecurring && (
        <div className="mt-1">
          <div className="flex items-center gap-2 mb-2">
            <RepeatIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Recurring Event</span>
          </div>
          
          <div className="ml-6 space-y-2">
            <div className="text-xs uppercase font-medium text-gray-500">Other dates:</div>
            <div className="space-y-1.5">
              {recurringEvents.map((recEvent) => (
                <div key={recEvent.id} className="text-sm">
                  <Badge variant="outline" className="mr-2">
                    {formatDate(recEvent.start_time || '')}
                  </Badge>
                  {formatTime(recEvent.start_time || '')}
                  {recEvent.end_time && ` - ${formatTime(recEvent.end_time)}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDateTimeInfo;
