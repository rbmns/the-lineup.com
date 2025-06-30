
import React from 'react';
import { Calendar, Clock, RepeatIcon, CalendarDays } from 'lucide-react';
import { Event } from '@/types';
import { formatEventDate, formatEventTime, formatEventCardDateTime, getUserTimezone } from '@/utils/timezone-utils';
import { isMultiDayEvent, getMultiDayDateRange } from '@/utils/event-date-utils';
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
  // Get viewer's timezone and event timezone
  const viewerTimezone = getUserTimezone();
  const eventTimezone = event.timezone || 'Europe/Amsterdam';
  
  // Check if we have valid date information
  if (!event.start_date) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 italic ${className}`}>
        <Calendar className={`h-4 w-4 flex-shrink-0 ${iconClassName}`} />
        <span>Date and time not specified</span>
      </div>
    );
  }
  
  const isMultiDay = isMultiDayEvent(event);
  const isRecurring = recurringEvents && recurringEvents.length > 0;

  // Format date and times in viewer's timezone
  const startDate = formatEventDate(event.start_date, eventTimezone, viewerTimezone);
  const startTime = event.start_time ? formatEventTime(event.start_date, event.start_time, eventTimezone, viewerTimezone) : null;
  const endTime = event.end_time ? formatEventTime(event.start_date, event.end_time, eventTimezone, viewerTimezone) : null;

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
          {isMultiDay ? (
            <>
              <div className="font-medium">{getMultiDayDateRange(event)}</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span>Starts {startTime}</span>
                {endTime && <span>• Ends {endTime}</span>}
              </div>
            </>
          ) : (
            <>
              <div className="font-medium">{startDate}</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span>{startTime}</span>
                {endTime && <span>- {endTime}</span>}
              </div>
            </>
          )}
          
          {/* Show timezone info if different from viewer's timezone */}
          {eventTimezone !== viewerTimezone && (
            <div className="text-xs text-gray-500">
              Event timezone: {eventTimezone}
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
              {recurringEvents.map((recEvent) => {
                const recEventDateTime = formatEventCardDateTime(
                  recEvent.start_date!, 
                  recEvent.start_time, 
                  recEvent.end_date,
                  recEvent.timezone || eventTimezone,
                  viewerTimezone
                );
                return (
                  <div key={recEvent.id} className="text-sm">
                    <Badge variant="outline" className="mr-2">
                      {recEventDateTime}
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
