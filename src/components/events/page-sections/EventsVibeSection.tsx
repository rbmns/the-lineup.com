
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
  // Extract unique vibes from events
  const vibes = [...new Set(events.map(event => event.vibe).filter(Boolean))] as string[];

  return (
    <div className="bg-[#F4E7D3] border border-[#E8DCC6] rounded-lg p-2 sm:p-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-[#005F73]">Vibes</h3>
        {selectedVibes.length > 0 && (
          <span className="px-1.5 py-0.5 bg-[#2A9D8F] text-white rounded-full text-xs font-medium">
            {selectedVibes.length}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-1.5">
        <button
          onClick={() => onVibeChange([])}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border transition-all ${
            selectedVibes.length === 0
              ? 'bg-[#005F73] text-white border-[#005F73]'
              : 'bg-white text-[#005F73] border-[#E8DCC6] hover:border-[#005F73]'
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
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border transition-all capitalize ${
              selectedVibes.includes(vibe)
                ? 'bg-[#005F73] text-white border-[#005F73]'
                : 'bg-white text-[#005F73] border-[#E8DCC6] hover:border-[#005F73]'
            }`}
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
};
