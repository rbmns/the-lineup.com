
import React from 'react';
import { VibeFilter } from '@/components/events/VibeFilter';
import { Event } from '@/types';

interface EventsVibeSectionProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  events: Event[];
  vibesLoading: boolean;
}

export const EventsVibeSection: React.FC<EventsVibeSectionProps> = ({
  selectedVibes,
  onVibeChange,
  events,
  vibesLoading
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium text-gray-700">Vibes</h3>
        {selectedVibes.length > 0 && (
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
            {selectedVibes.length}
          </span>
        )}
      </div>
      <VibeFilter
        selectedVibes={selectedVibes}
        onVibeChange={onVibeChange}
        events={events}
        isLoading={vibesLoading}
        className="gap-1.5"
        compact={true}
      />
    </div>
  );
};
