
import React from 'react';
import VibeFilter from '@/components/polymet/vibe-filter';

interface EventsVibeSectionProps {
  selectedVibe: string | null;
  onVibeChange: (vibe: string | null) => void;
}

export const EventsVibeSection: React.FC<EventsVibeSectionProps> = ({
  selectedVibe,
  onVibeChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Find your vibe</h2>
      </div>
      
      <div className="w-full">
        <VibeFilter
          selectedVibe={selectedVibe}
          onChange={onVibeChange}
          size="md"
          className="w-full"
        />
      </div>
    </div>
  );
};
