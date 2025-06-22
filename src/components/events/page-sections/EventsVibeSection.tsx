
import React from 'react';
import { EnhancedVibeFilter } from '@/components/events/EnhancedVibeFilter';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsVibeSectionProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  vibes?: string[];
  vibesLoading?: boolean;
}

export const EventsVibeSection: React.FC<EventsVibeSectionProps> = ({
  selectedVibes,
  onVibeChange,
  vibes = ['general', 'energetic', 'chill', 'social', 'cultural'],
  vibesLoading = false,
}) => {
  const isMobile = useIsMobile();

  if (vibesLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-semibold tracking-tight`}>Find your vibe</h2>
        </div>
        <div className="animate-pulse">
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`${isMobile ? 'h-10 w-20' : 'h-12 w-24'} bg-gray-200 rounded-full flex-shrink-0`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Update the count display logic
  const getCountDisplay = () => {
    if (selectedVibes.length === 0) {
      return `Showing all events (${vibes.length} vibes available)`;
    }
    return `${selectedVibes.length} of ${vibes.length} vibes selected`;
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-semibold tracking-tight`}>Find your vibe</h2>
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {getCountDisplay()}
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
