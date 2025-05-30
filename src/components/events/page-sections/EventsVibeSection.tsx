
import React from 'react';
import VibeFilter from '@/components/polymet/vibe-filter';

interface EventsVibeSectionProps {
  selectedVibe: string | null;
  onVibeChange: (vibe: string | null) => void;
  vibes: string[];
  vibesLoading: boolean;
}

export const EventsVibeSection: React.FC<EventsVibeSectionProps> = ({
  selectedVibe,
  onVibeChange,
  vibes,
  vibesLoading,
}) => {
  if (vibesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Find your vibe</h2>
        </div>
        <div className="animate-pulse">
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full w-20 flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Find your vibe</h2>
      </div>
      
      <div className="w-full">
        <VibeFilter
          selectedVibe={selectedVibe}
          onChange={onVibeChange}
          vibes={vibes}
          size="md"
          className="w-full"
        />
      </div>
    </div>
  );
};
