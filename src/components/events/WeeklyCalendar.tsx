
import React, { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { Event } from '@/types';
import { getWeekRange } from '@/utils/event-date-utils';
import { Button } from '@/components/ui/button';
import { EventDayDetails } from './EventDayDetails';

interface WeeklyCalendarProps {
  events: Event[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  events,
  onDateSelect,
  selectedDate
}) => {
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const weekDays = getWeekRange(weekStart);
  
  const goToPreviousWeek = () => {
    setWeekStart(prevWeek => addDays(prevWeek, -7));
  };
  
  const goToNextWeek = () => {
    setWeekStart(prevWeek => addDays(prevWeek, 7));
  };
  
  const goToToday = () => {
    setWeekStart(new Date());
    onDateSelect(new Date());
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      if (!event.start_time) return false;
      return isSameDay(new Date(event.start_time), date);
    });
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Weekly Calendar</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="text-sm"
          >
            Today
          </Button>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousWeek}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium mx-2">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d')}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextWeek}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="divide-y">
        {weekDays.map((day, index) => (
          <EventDayDetails
            key={index}
            date={day}
            events={getEventsForDate(day)}
            isSelected={isSameDay(day, selectedDate)}
            onSelect={onDateSelect}
          />
        ))}
      </div>
    </div>
  );
};
