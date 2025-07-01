
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
      // ALWAYS use timestampz fields first if available
      if (startDateTime) {
        console.log(`[EventDateTimeSection] Using timestampz fields: ${startDateTime} -> ${endDateTime}`);
        return formatEventTimeRange(startDateTime, endDateTime, timezone);
      }
      
      // Only fallback to legacy fields if no timestampz data
      if (startDate && startTime) {
        console.log(`[EventDateTimeSection] Using legacy fields: ${startDate}T${startTime}`);
        const startDateTimeString = `${startDate}T${startTime}`;
        const endDateTimeString = endTime ? `${startDate}T${endTime}` : null;
        return formatEventTimeRange(startDateTimeString, endDateTimeString, timezone);
      }
      
      return '';
    } catch (error) {
      console.error('Error formatting time range:', error);
      return '';
    }
  }, [startDateTime, endDateTime, timezone, startTime, endTime, startDate]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    try {
      let eventDateTime: Date;
      
      // ALWAYS use timestampz field first if available
      if (startDateTime) {
        console.log(`[EventDateTimeSection] Calculating time until using timestampz: ${startDateTime}`);
        eventDateTime = createEventDateTime(startDateTime);
      } else if (startTime && startDate) {
        console.log(`[EventDateTimeSection] Calculating time until using legacy: ${startDate}T${startTime}`);
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
  }, [startDateTime, startTime, startDate, timezone]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    try {
      let startEventDateTime: Date;
      let endEventDateTime: Date;
      
      // ALWAYS use timestampz fields first if available
      if (startDateTime && endDateTime) {
        console.log(`[EventDateTimeSection] Calculating duration using timestampz: ${startDateTime} -> ${endDateTime}`);
        startEventDateTime = createEventDateTime(startDateTime);
        endEventDateTime = createEventDateTime(endDateTime);
      } else if (startTime && endTime && startDate) {
        console.log(`[EventDateTimeSection] Calculating duration using legacy: ${startDate}T${startTime} -> ${startDate}T${endTime}`);
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
  }, [startDateTime, endDateTime, timezone, startTime, endTime, startDate]);

  // For the display format "Sunday, 18 May 2025, 15:00 – 20:00"
  const displayDateTime = useMemo(() => {
    try {
      let dateTimeToFormat: string;
      
      // ALWAYS use timestampz field first if available
      if (startDateTime) {
        console.log(`[EventDateTimeSection] Formatting display using timestampz: ${startDateTime}`);
        dateTimeToFormat = startDateTime;
      } else if (startDate) {
        console.log(`[EventDateTimeSection] Formatting display using legacy: ${startDate}`);
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
      
      console.log(`[EventDateTimeSection] Final formatted display: ${formatted}`);
      return formatted;
    } catch (error) {
      console.error('Error formatting display date time:', error);
      return '';
    }
  }, [startDateTime, startDate, formattedTimeRange, timezone, city]);

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
