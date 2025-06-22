
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVibeColorClasses } from '@/utils/vibeColors';

interface EnhancedVibeFilterProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  vibes: string[];
  isLoading?: boolean;
  className?: string;
}

export const EnhancedVibeFilter: React.FC<EnhancedVibeFilterProps> = ({
  selectedVibes,
  onVibeChange,
  vibes,
  isLoading = false,
  className = ''
}) => {
  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      // Remove the vibe
      onVibeChange(selectedVibes.filter(v => v !== vibe));
    } else {
      // Add the vibe
      onVibeChange([...selectedVibes, vibe]);
    }
  };

  const handleAllClick = () => {
    onVibeChange([]); // Clear all vibe selections to show all events
  };

  // Check if no vibes are selected (showing all events)
  const noVibesSelected = selectedVibes.length === 0;

  if (isLoading) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-20 flex-shrink-0 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* All button - shows all events when selected */}
      <button
        className={cn(
          "flex-shrink-0 transition-all duration-200 font-medium rounded-full px-3 py-1 text-sm",
          noVibesSelected
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
        )}
        onClick={handleAllClick}
      >
        All Vibes
      </button>
      
      {/* Individual vibe buttons with unique colors */}
      {vibes.map((vibe) => {
        const isSelected = selectedVibes.includes(vibe);
        
        return (
          <button
            key={vibe}
            className={cn(
              "flex-shrink-0 transition-all duration-200 capitalize",
              getVibeColorClasses(vibe, isSelected, 'md')
            )}
            onClick={() => handleVibeToggle(vibe)}
          >
            {vibe}
          </button>
        );
      })}
    </div>
  );
};
