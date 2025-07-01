
import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { formatEventTimeRange, formatEventDate, createEventDateTime } from '@/utils/timezone-utils';

interface EventDateTimeSectionProps {
  startTime?: string;
  endTime?: string;
  startDate?: string;
  startDateTime?: string;
  endDateTime?: string;
  timezone?: string;
  city?: string;
}

export const EventDateTimeSection = ({ 
  startTime, 
  endTime, 
  startDate,
  startDateTime,
  endDateTime,
  timezone = 'Europe/Amsterdam',
  city
}: EventDateTimeSectionProps) => {
  
  // Format time range for detail view in event's local timezone
  const formattedTimeRange = useMemo(() => {
    try {
      // Use timestampz fields first
      if (startDateTime) {
        return formatEventTimeRange(startDateTime, endDateTime, timezone);
      }
      
      // Fallback to legacy fields
      if (startDate && startTime) {
        const startDateTimeString = `${startDate}T${startTime}`;
        const endDateTimeString = endTime ? `${startDate}T${endTime}` : null;
        return formatEventTimeRange(startDateTimeString, endDateTimeString, timezone);
      }
      
      return '';
    } catch (error) {
      console.error('Error formatting time range:', error);
      return '';
    }
  }, [startTime, endTime, startDate, startDateTime, endDateTime, timezone]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    try {
      let eventDateTime: Date;
      
      // Use timestampz field first
      if (startDateTime) {
        eventDateTime = createEventDateTime(startDateTime);
      } else if (startTime && startDate) {
        eventDateTime = createEventDateTime(`${startDate}T${startTime}`);
      } else {
        return '';
      }
      
      if (eventDateTime <= new Date()) return 'Event has started';
      return `Starts ${formatDistanceToNow(eventDateTime, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [startTime, startDate, startDateTime, timezone]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    try {
      let startEventDateTime: Date;
      let endEventDateTime: Date;
      
      // Use timestampz fields first
      if (startDateTime && endDateTime) {
        startEventDateTime = createEventDateTime(startDateTime);
        endEventDateTime = createEventDateTime(endDateTime);
      } else if (startTime && endTime && startDate) {
        startEventDateTime = createEventDateTime(`${startDate}T${startTime}`);
        endEventDateTime = createEventDateTime(`${startDate}T${endTime}`);
      } else {
        return '';
      }
      
      const durationHours = Math.abs(endEventDateTime.getTime() - startEventDateTime.getTime()) / (1000 * 60 * 60);
      
      if (durationHours < 1) {
        const durationMinutes = Math.round(durationHours * 60);
        return `${durationMinutes} minutes`;
      }
      
      return `${durationHours.toFixed(1)} hours`;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return '';
    }
  }, [startTime, endTime, startDate, startDateTime, endDateTime, timezone]);

  // For the display format "Sunday, 18 May 2025, 15:00 – 20:00"
  const displayDateTime = useMemo(() => {
    try {
      let dateTimeToFormat: string;
      
      // Use timestampz field first
      if (startDateTime) {
        dateTimeToFormat = startDateTime;
      } else if (startDate) {
        dateTimeToFormat = startDate;
      } else {
        return '';
      }
      
      let formatted = formatEventDate(dateTimeToFormat, timezone);
      
      if (formattedTimeRange) {
        formatted += `, ${formattedTimeRange}`;
        
        // Add city context if provided and timezone is not Amsterdam
        if (city && timezone !== 'Europe/Amsterdam') {
          formatted += ` (${city} local time)`;
        }
      }
      
      return formatted;
    } catch (error) {
      console.error('Error formatting display date time:', error);
      return '';
    }
  }, [startDate, startDateTime, formattedTimeRange, timezone, city]);

  return (
    <div className="flex items-start space-x-2">
      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg">{displayDateTime}</p>
        {timeUntilEvent && (
          <p className="text-sm text-gray-600 mt-1">{timeUntilEvent}</p>
        )}
        {eventDuration && (
          <p className="text-sm text-gray-600">Duration: {eventDuration}</p>
        )}
      </div>
    </div>
  );
};
