
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Event } from '@/types';
import { eventTypeColors } from '@/utils/eventImages';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

interface EventDayDetailsProps {
  date: Date;
  events: Event[];
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

export const EventDayDetails: React.FC<EventDayDetailsProps> = ({
  date,
  events,
  isSelected,
  onSelect,
}) => {
  const amsterdamDate = toZonedTime(date, AMSTERDAM_TIMEZONE);
  const today = formatInTimeZone(new Date(), AMSTERDAM_TIMEZONE, 'yyyy-MM-dd');
  const isToday = formatInTimeZone(amsterdamDate, AMSTERDAM_TIMEZONE, 'yyyy-MM-dd') === today;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          onClick={() => onSelect(date)}
          className={`p-4 cursor-pointer transition-all duration-300 ${
            isSelected 
              ? 'bg-blue-50 border-l-4 border-blue-600' 
              : isToday 
                ? 'bg-blue-50/50 border-l-4 border-blue-400' 
                : 'hover:bg-gray-50 border-l-4 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">
                {formatInTimeZone(amsterdamDate, AMSTERDAM_TIMEZONE, 'EEEE')}
              </div>
              <div className={`text-xl font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                {formatInTimeZone(amsterdamDate, AMSTERDAM_TIMEZONE, 'd MMM')}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {events.length === 0 ? (
                  'No events'
                ) : (
                  `${events.length} event${events.length === 1 ? '' : 's'}`
                )}
              </div>
            </div>
            {events.length > 0 && (
              <div className="flex gap-1.5 items-center">
                {Array.from(new Set(events.map(event => event.event_type))).map((type, index) => {
                  const eventType = type?.toLowerCase() || 'other';
                  const colors = eventTypeColors[eventType as keyof typeof eventTypeColors] || eventTypeColors.other;
                  return (
                    <div 
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full ${colors.active.bg}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      {events.length > 0 && (
        <HoverCardContent className="w-80" align="start">
          <div className="space-y-2">
            <h3 className="font-medium">
              Events on {formatInTimeZone(amsterdamDate, AMSTERDAM_TIMEZONE, 'd MMMM yyyy')}
            </h3>
            {events.map((event) => (
              <div key={event.id} className="text-sm">
                <div className="font-medium">{event.title}</div>
                <div className="text-gray-500">
                  {event.start_time && formatInTimeZone(new Date(event.start_time), AMSTERDAM_TIMEZONE, 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};
