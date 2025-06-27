
import React from 'react';
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
  // Extract unique vibes from events
  const vibes = [...new Set(events.map(event => event.vibe).filter(Boolean))] as string[];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-700">Vibes</h3>
        {selectedVibes.length > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {selectedVibes.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onVibeChange([])}
          className={`px-3 py-1.5 text-sm rounded-full border transition-all font-medium ${
            selectedVibes.length === 0
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {vibes.map((vibe) => (
          <button
            key={vibe}
            onClick={() => {
              const newVibes = selectedVibes.includes(vibe)
                ? selectedVibes.filter(v => v !== vibe)
                : [...selectedVibes, vibe];
              onVibeChange(newVibes);
            }}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all capitalize font-medium ${
              selectedVibes.includes(vibe)
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
};
