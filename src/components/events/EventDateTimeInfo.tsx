
import React from 'react';
import { Calendar, Clock, RepeatIcon, CalendarDays } from 'lucide-react';
import { Event } from '@/types';
import { formatEventDateTime, formatEventEndDateTime, getUserTimezone } from '@/utils/timezone-utils';
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
  // Get viewer's timezone
  const viewerTimezone = getUserTimezone();
  
  // Use unified datetime formatting
  const { date, time } = formatEventDateTime({
    start_datetime: event.start_datetime,
    start_date: event.start_date || undefined,
    start_time: event.start_time || undefined,
    timezone: event.timezone
  }, viewerTimezone);
  
  const endTime = formatEventEndDateTime({
    end_datetime: event.end_datetime,
    start_datetime: event.start_datetime,
    start_date: event.start_date || undefined,
    end_time: event.end_time || undefined,
    timezone: event.timezone
  }, viewerTimezone);
  
  // Check if we have valid date information
  if (!event.start_datetime && !event.start_date) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 italic ${className}`}>
        <Calendar className={`h-4 w-4 flex-shrink-0 ${iconClassName}`} />
        <span>Date and time not specified</span>
      </div>
    );
  }
  
  // Check for multi-day events
  const isMultiDay = event.end_date && event.start_date && event.end_date !== event.start_date;
  const isRecurring = recurringEvents && recurringEvents.length > 0;

  return (
    <div className={`flex flex-col gap-2 text-gray-700 ${className}`}>
      {/* Multi-day event badge */}
      {isMultiDay && (
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Multi-day event
          </Badge>
        </div>
      )}

      {/* Main date display */}
      <div className="flex items-start gap-2">
        <Calendar className={`flex-shrink-0 text-gray-500 mt-1 ${iconClassName}`} />
        <div className="space-y-1">
          <div className="font-medium">{date}</div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span>{time}</span>
            {endTime && <span>- {endTime}</span>}
          </div>
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
              {recurringEvents.map((recEvent) => {
                const recEventDateTime = formatEventDateTime({
                  start_datetime: recEvent.start_datetime,
                  start_date: recEvent.start_date || undefined,
                  start_time: recEvent.start_time || undefined,
                  timezone: recEvent.timezone
                }, viewerTimezone);
                
                return (
                  <div key={recEvent.id} className="text-sm">
                    <Badge variant="outline" className="mr-2">
                      {recEventDateTime.dateTime}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDateTimeInfo;
