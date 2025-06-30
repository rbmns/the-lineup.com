
import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatEventDateTime, formatEventEndDateTime, getUserTimezone } from '@/utils/timezone-utils';

interface EventDateTimeSectionProps {
  event: {
    start_datetime?: string;
    end_datetime?: string;
    start_date?: string;
    start_time?: string;
    end_time?: string;   
    timezone?: string;
  };
}

export const EventDateTimeSection = ({ event }: EventDateTimeSectionProps) => {
  const viewerTimezone = getUserTimezone();
  
  // Format the main datetime display using unified approach
  const { date, time, dateTime } = useMemo(() => {
    return formatEventDateTime(event, viewerTimezone);
  }, [event, viewerTimezone]);
  
  // Format end time if available
  const endTime = useMemo(() => {
    return formatEventEndDateTime(event, viewerTimezone);
  }, [event, viewerTimezone]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    try {
      let eventDateTime: Date;
      
      // Use new timestamptz field if available
      if (event.start_datetime) {
        eventDateTime = new Date(event.start_datetime);
      } 
      // Fallback to legacy fields
      else if (event.start_date && event.start_time) {
        const eventTimezone = event.timezone || 'Europe/Amsterdam';
        const dateTimeStr = `${event.start_date}T${event.start_time}`;
        eventDateTime = new Date(dateTimeStr + (eventTimezone === 'Europe/Amsterdam' ? '+01:00' : '+00:00'));
      }
      else {
        return '';
      }
      
      if (eventDateTime <= new Date()) return 'Event has started';
      return `Starts ${formatDistanceToNow(eventDateTime, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [event]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    try {
      let startDateTime: Date;
      let endDateTime: Date;
      
      // Use new timestamptz fields if available
      if (event.start_datetime && event.end_datetime) {
        startDateTime = new Date(event.start_datetime);
        endDateTime = new Date(event.end_datetime);
      }
      // Fallback to legacy fields
      else if (event.start_date && event.start_time && event.end_time) {
        const eventTimezone = event.timezone || 'Europe/Amsterdam';
        const tzOffset = eventTimezone === 'Europe/Amsterdam' ? '+01:00' : '+00:00';
        startDateTime = new Date(`${event.start_date}T${event.start_time}${tzOffset}`);
        endDateTime = new Date(`${event.start_date}T${event.end_time}${tzOffset}`);
      }
      else {
        return '';
      }
      
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
  }, [event]);

  return (
    <div className="flex items-start space-x-2">
      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium">
          {date}, {time}
          {endTime && ` - ${endTime}`}
        </p>
        <p className="text-sm text-gray-600">{timeUntilEvent}</p>
        {eventDuration && (
          <p className="text-sm text-gray-600">Duration: {eventDuration}</p>
        )}
      </div>
    </div>
  );
};
