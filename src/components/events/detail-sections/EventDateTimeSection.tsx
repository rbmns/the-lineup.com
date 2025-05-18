
import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { formatDistanceToNow } from 'date-fns';

const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

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
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEEE, MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(startTime);
    }
  }, [startTime]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    if (!startTime) return '';
    
    try {
      const date = new Date(startTime);
      if (date <= new Date()) return 'Event has started';
      return `Starts ${formatDistanceToNow(date, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [startTime]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    if (!startTime || !endTime) return '';
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHours = Math.abs(end.getTime() - start.getTime()) / 36e5;
      return `${durationHours.toFixed(1)} hours`;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return '';
    }
  }, [startTime, endTime]);

  return (
    <div className="flex items-start space-x-2">
      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium">{formattedDate}</p>
        <p className="text-sm text-gray-600">{timeUntilEvent}</p>
        {eventDuration && (
          <p className="text-sm text-gray-600">Duration: {eventDuration}</p>
        )}
      </div>
    </div>
  );
};
