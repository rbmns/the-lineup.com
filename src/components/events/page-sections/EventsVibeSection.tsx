
import React from 'react';
import { EnhancedVibeFilter } from '@/components/events/EnhancedVibeFilter';

interface EventsVibeSectionProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  vibes: string[];
  vibesLoading: boolean;
}

export const EventsVibeSection: React.FC<EventsVibeSectionProps> = ({
  selectedVibes,
  onVibeChange,
  vibes,
  vibesLoading,
}) => {
  if (vibesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Find your vibe</h2>
        </div>
        <div className="animate-pulse">
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-full w-24 flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Find your vibe</h2>
        <div className="text-sm text-gray-600">
          {selectedVibes.length === vibes.length || selectedVibes.length === 0 
            ? `All vibes (${vibes.length})` 
            : `${selectedVibes.length} of ${vibes.length} vibes`}
        </div>
      </div>
      
      <div className="w-full">
        <EnhancedVibeFilter
          selectedVibes={selectedVibes}
          onVibeChange={onVibeChange}
          vibes={vibes}
          isLoading={vibesLoading}
          className="w-full"
        />
      </div>
    </div>
  );
};
