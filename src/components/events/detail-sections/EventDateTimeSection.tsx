
import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { formatEventTime, formatEventDate, createEventDateTime, getUserTimezone } from '@/utils/timezone-utils';

interface EventDateTimeSectionProps {
  startTime?: string;
  endTime?: string;
  startDate?: string;
  timezone?: string;
}

export const EventDateTimeSection = ({ 
  startTime, 
  endTime, 
  startDate,
  timezone = 'Europe/Amsterdam'
}: EventDateTimeSectionProps) => {
  
  const viewerTimezone = getUserTimezone();
  
  // Format time range for detail view in viewer's timezone
  const formattedTimeRange = useMemo(() => {
    if (!startTime || !startDate) return '';
    if (!endTime) return formatEventTime(startDate, startTime, timezone, viewerTimezone);
    
    try {
      const startFormatted = formatEventTime(startDate, startTime, timezone, viewerTimezone);
      const endFormatted = formatEventTime(startDate, endTime, timezone, viewerTimezone);
      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      console.error('Error formatting time range:', error);
      return '';
    }
  }, [startTime, endTime, startDate, timezone, viewerTimezone]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    if (!startTime || !startDate) return '';
    
    try {
      const eventDateTime = createEventDateTime(startDate, startTime, timezone);
      
      if (eventDateTime <= new Date()) return 'Event has started';
      return `Starts ${formatDistanceToNow(eventDateTime, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [startTime, startDate, timezone]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    if (!startTime || !endTime || !startDate) return '';
    
    try {
      const startDateTime = createEventDateTime(startDate, startTime, timezone);
      const endDateTime = createEventDateTime(startDate, endTime, timezone);
      
      const durationHours = Math.abs(endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      
      if (durationHours < 1) {
        const durationMinutes = Math.round(durationHours * 60);
        return `${durationMinutes} minutes`;
      }
      
      return `${durationHours.toFixed(1)} hours`;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return '';
    }
  }, [startTime, endTime, startDate, timezone]);

  // For the display format "Sunday, 18 May 2025, 15:00 - 20:00" in viewer's timezone
  const displayDateTime = useMemo(() => {
    if (!startDate) return '';
    
    try {
      let formatted = formatEventDate(startDate, timezone, viewerTimezone);
      
      if (formattedTimeRange) {
        formatted += `, ${formattedTimeRange}`;
      }
      
      return formatted;
    } catch (error) {
      console.error('Error formatting display date time:', error);
      return '';
    }
  }, [startDate, formattedTimeRange, timezone, viewerTimezone]);

  return (
    <div className="flex items-start space-x-2">
      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium">{displayDateTime}</p>
        <p className="text-sm text-gray-600">{timeUntilEvent}</p>
        {eventDuration && (
          <p className="text-sm text-gray-600">Duration: {eventDuration}</p>
        )}
        {timezone !== viewerTimezone && (
          <p className="text-xs text-gray-500 mt-1">
            Event timezone: {timezone}
          </p>
        )}
      </div>
    </div>
  );
};
