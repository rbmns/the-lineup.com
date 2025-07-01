
import React from 'react';
import { Calendar, Clock, RepeatIcon, CalendarDays } from 'lucide-react';
import { Event } from '@/types';
import { formatEventDate, formatEventTimeRange, formatEventCardDateTime } from '@/utils/timezone-utils';
import { Badge } from '../ui/badge';

interface EventDateTimeInfoProps {
  event: Event;
  className?: string;
  iconClassName?: string;
  showRecurring?: boolean;
  recurringEvents?: Event[];
}

// Check if event spans multiple days using timestampz fields
function isMultiDayEvent(event: Event): boolean {
  if (!event.start_datetime || !event.end_datetime) return false;
  
  try {
    const eventTimezone = event.timezone || 'Europe/Amsterdam';
    const startDate = new Date(event.start_datetime);
    const endDate = new Date(event.end_datetime);
    
    // Format dates to compare date parts only
    const startDateStr = startDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const endDateStr = endDate.toLocaleDateString('en-CA');
    
    return startDateStr !== endDateStr;
  } catch (error) {
    console.error('Error checking multi-day event:', error);
    return false;
  }
}

// Get multi-day date range using timestampz fields
function getMultiDayDateRange(event: Event): string {
  if (!event.start_datetime || !event.end_datetime) return '';
  
  try {
    const eventTimezone = event.timezone || 'Europe/Amsterdam';
    const startFormatted = formatEventDate(event.start_datetime, eventTimezone);
    const endFormatted = formatEventDate(event.end_datetime, eventTimezone);
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting multi-day range:', error);
    return '';
  }
}

export const EventDateTimeInfo: React.FC<EventDateTimeInfoProps> = ({ 
  event,
  className = "",
  iconClassName = "",
  showRecurring = false,
  recurringEvents = []
}) => {
  // Get event timezone
  const eventTimezone = event.timezone || 'Europe/Amsterdam';
  
  // Check if we have valid date information
  const hasValidDateTime = event.start_datetime;
  
  if (!hasValidDateTime) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 italic ${className}`}>
        <Calendar className={`h-4 w-4 flex-shrink-0 ${iconClassName}`} />
        <span>Date and time not specified</span>
      </div>
    );
  }
  
  const isMultiDay = isMultiDayEvent(event);
  const isRecurring = recurringEvents && recurringEvents.length > 0;

  // Format date and times using timestampz fields
  const startDate = formatEventDate(event.start_datetime, eventTimezone);
  const timeRange = formatEventTimeRange(
    event.start_datetime, 
    event.end_datetime, 
    eventTimezone
  );

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
                <span>{timeRange || 'Time not specified'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="font-medium">{startDate}</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span>{timeRange || 'Time not specified'}</span>
              </div>
            </>
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
                const recEventDateTime = recEvent.start_datetime 
                  ? formatEventCardDateTime(
                      recEvent.start_datetime,
                      recEvent.end_datetime,
                      recEvent.timezone || eventTimezone
                    )
                  : 'Date not specified';
                
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
