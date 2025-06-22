
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  // CRITICAL CHANGE: "All" button now deselects all vibes (showing no events)
  const handleAllClick = () => {
    onVibeChange([]); // Deselect all vibes
  };

  // Check if all vibes are selected
  const allVibesSelected = selectedVibes.length === vibes.length && vibes.length > 0;
  // NEW: Check if no vibes are selected
  const noVibesSelected = selectedVibes.length === 0;

  if (isLoading) {
    return (
      <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-20 flex-shrink-0 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2 scrollbar-hide", className)}>
      {/* All button - NOW deselects all when clicked */}
      <Button
        variant={noVibesSelected ? "default" : "outline"}
        size="sm"
        className={cn(
          "flex-shrink-0 transition-all duration-200 font-medium",
          noVibesSelected
            ? "bg-primary text-white hover:bg-primary/90"
            : "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
        )}
        onClick={handleAllClick}
      >
        All
      </Button>
      
      {/* Individual vibe buttons */}
      {vibes.map((vibe) => {
        const isSelected = selectedVibes.includes(vibe);
        
        return (
          <Button
            key={vibe}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex-shrink-0 transition-all duration-200 font-medium capitalize",
              isSelected
                ? "bg-vibrant-seafoam text-white hover:bg-vibrant-seafoam/90"
                : "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
            )}
            onClick={() => handleVibeToggle(vibe)}
          >
            {vibe}
          </Button>
        );
      })}
    </div>
  );
};
