
import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { formatDistanceToNow } from 'date-fns';
import { AMSTERDAM_TIMEZONE } from '@/utils/date-formatting';

interface EventDateTimeSectionProps {
  startTime?: string;
  endTime?: string;
}

export const EventDateTimeSection = ({ startTime, endTime }: EventDateTimeSectionProps) => {
  // Format date for detail view
  const formattedDate = useMemo(() => {
    if (!startTime) return '';
    
    try {
      const date = new Date(startTime);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEEE, d MMMM yyyy, HH:mm");
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(startTime);
    }
  }, [startTime]);
  
  // Format time range for detail view
  const formattedTimeRange = useMemo(() => {
    if (!startTime) return '';
    if (!endTime) return '';
    
    try {
      // Check if these are full datetime strings or just time strings
      let startDate, endDate;
      
      if (startTime.includes('T') || startTime.includes(' ')) {
        // Full datetime string
        startDate = new Date(startTime);
        endDate = new Date(endTime);
      } else {
        // Just time strings - use today's date
        const today = new Date().toISOString().split('T')[0];
        startDate = new Date(`${today}T${startTime}`);
        endDate = new Date(`${today}T${endTime}`);
      }
      
      const startFormatted = formatInTimeZone(startDate, AMSTERDAM_TIMEZONE, "HH:mm");
      const endFormatted = formatInTimeZone(endDate, AMSTERDAM_TIMEZONE, "HH:mm");
      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      console.error('Error formatting time range:', error);
      return '';
    }
  }, [startTime, endTime]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    if (!startTime) return '';
    
    try {
      let date;
      if (startTime.includes('T') || startTime.includes(' ')) {
        date = new Date(startTime);
      } else {
        // Just time string - use today's date
        const today = new Date().toISOString().split('T')[0];
        date = new Date(`${today}T${startTime}`);
      }
      
      if (date <= new Date()) return 'Event has started';
      return `Starts ${formatDistanceToNow(date, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [startTime]);
  
  // Format event duration - only if both times are valid
  const eventDuration = useMemo(() => {
    if (!startTime || !endTime) return '';
    
    try {
      let startDate, endDate;
      
      if (startTime.includes('T') || startTime.includes(' ')) {
        // Full datetime strings
        startDate = new Date(startTime);
        endDate = new Date(endTime);
      } else {
        // Just time strings - use today's date
        const today = new Date().toISOString().split('T')[0];
        startDate = new Date(`${today}T${startTime}`);
        endDate = new Date(`${today}T${endTime}`);
      }
      
      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return '';
      }
      
      const durationHours = Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      
      if (durationHours < 1) {
        const durationMinutes = Math.round(durationHours * 60);
        return `${durationMinutes} minutes`;
      }
      
      return `${durationHours.toFixed(1)} hours`;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return '';
    }
  }, [startTime, endTime]);

  // For the display format "Sunday, 18 May 2025, 15:00 - 20:00"
  const displayDateTime = useMemo(() => {
    if (!startTime) return '';
    
    try {
      let date;
      if (startTime.includes('T') || startTime.includes(' ')) {
        date = new Date(startTime);
      } else {
        const today = new Date().toISOString().split('T')[0];
        date = new Date(`${today}T${startTime}`);
      }
      
      let formatted = formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEEE, d MMMM yyyy");
      
      if (formattedTimeRange) {
        formatted += `, ${formattedTimeRange}`;
      }
      
      return formatted;
    } catch (error) {
      console.error('Error formatting display date time:', error);
      return '';
    }
  }, [startTime, formattedTimeRange]);

  return (
    <div className="flex items-start space-x-2">
      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium">{displayDateTime}</p>
        <p className="text-sm text-gray-600">{timeUntilEvent}</p>
        {eventDuration && (
          <p className="text-sm text-gray-600">Duration: {eventDuration}</p>
        )}
      </div>
    </div>
  );
};
