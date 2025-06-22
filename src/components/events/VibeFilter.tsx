
import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getVibeColorClasses } from '@/utils/vibeColors';

interface VibeFilterProps {
  vibes: string[];
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  isLoading?: boolean;
  className?: string;
}

export const VibeFilter: React.FC<VibeFilterProps> = ({
  vibes,
  selectedVibes,
  onVibeChange,
  isLoading = false,
  className = ""
}) => {
  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      // Remove vibe
      onVibeChange(selectedVibes.filter(v => v !== vibe));
    } else {
      // Add vibe
      onVibeChange([...selectedVibes, vibe]);
    }
  };

  const handleSelectAll = () => {
    onVibeChange(vibes);
  };

  const handleClearAll = () => {
    onVibeChange([]);
  };

  const isAllSelected = selectedVibes.length === vibes.length;
  const noVibesSelected = selectedVibes.length === 0;

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Sparkles className="h-4 w-4" />
          <span>Vibe</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-16 animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Sparkles className="h-4 w-4" />
          <span>Vibe</span>
          {selectedVibes.length > 0 && selectedVibes.length < vibes.length && (
            <span className="text-xs text-gray-500">({selectedVibes.length})</span>
          )}
        </div>
        {selectedVibes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {/* All button */}
        <button
          className={cn(
            "flex-shrink-0 transition-all duration-200 font-medium rounded-full px-3 py-1 text-sm",
            noVibesSelected
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
          )}
          onClick={handleClearAll}
        >
          All
        </button>
        
        {/* Individual vibe buttons with colors */}
        {vibes.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe);
          
          return (
            <button
              key={vibe}
              className={cn(
                "flex-shrink-0 transition-all duration-200 capitalize",
                getVibeColorClasses(vibe, isSelected, 'sm')
              )}
              onClick={() => handleVibeToggle(vibe)}
            >
              {vibe}
            </button>
          );
        })}
      </div>
    </div>
  );
};
