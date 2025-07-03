
import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { formatEventTimeRange, formatEventDate, createEventDateTime } from '@/utils/timezone-utils';

interface EventDateTimeSectionProps {
  startDateTime?: string;
  endDateTime?: string;
  timezone?: string;
  city?: string;
}

export const EventDateTimeSection = ({ 
  startDateTime,
  endDateTime,
  timezone = 'Europe/Amsterdam',
  city
}: EventDateTimeSectionProps) => {
  
  // Format time range for detail view in event's local timezone
  const formattedTimeRange = useMemo(() => {
    try {
      if (startDateTime) {
        return formatEventTimeRange(startDateTime, endDateTime, timezone);
      }
      return '';
    } catch (error) {
      console.error('Error formatting time range:', error);
      return '';
    }
  }, [startDateTime, endDateTime, timezone]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    try {
      if (startDateTime) {
        const eventDateTime = createEventDateTime(startDateTime);
        if (eventDateTime <= new Date()) return 'Event has started';
        return `Starts ${formatDistanceToNow(eventDateTime, { addSuffix: true })}`;
      }
      return '';
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [startDateTime, timezone]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    try {
      if (startDateTime && endDateTime) {
        const startEventDateTime = createEventDateTime(startDateTime);
        const endEventDateTime = createEventDateTime(endDateTime);
        
        const durationHours = Math.abs(endEventDateTime.getTime() - startEventDateTime.getTime()) / (1000 * 60 * 60);
        
        if (durationHours < 1) {
          const durationMinutes = Math.round(durationHours * 60);
          return `${durationMinutes} minutes`;
        }
        
        return `${durationHours.toFixed(1)} hours`;
      }
      return '';
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return '';
    }
  }, [startDateTime, endDateTime, timezone]);

  // For the display format "Sunday, 18 May 2025, 15:00 – 20:00"
  const displayDateTime = useMemo(() => {
    try {
      if (startDateTime) {
        let formatted = formatEventDate(startDateTime, timezone);
        
        if (formattedTimeRange) {
          formatted += `, ${formattedTimeRange}`;
          
          // Add city context if provided and timezone is not Amsterdam
          if (city && timezone !== 'Europe/Amsterdam') {
            formatted += ` (${city} local time)`;
          }
        }
        
        return formatted;
      }
      return '';
    } catch (error) {
      console.error('Error formatting display date time:', error);
      return '';
    }
  }, [startDateTime, formattedTimeRange, timezone, city]);

  return (
    <div className="flex items-start space-x-2">
      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg">{displayDateTime}</p>
        {timeUntilEvent && (
          <p className="text-sm text-gray-600 mt-1">{timeUntilEvent}</p>
        )}
      </div>
    </div>
  );
};
