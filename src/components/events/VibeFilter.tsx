
import React from 'react';
import { CategoryPill } from '@/components/ui/category-pill';
import { Sparkles } from 'lucide-react';

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

  const handleClearAll = () => {
    onVibeChange([]);
  };

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
          {selectedVibes.length > 0 && (
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
        {vibes.map((vibe) => (
          <CategoryPill 
            key={vibe}
            category={vibe} 
            active={selectedVibes.includes(vibe)} 
            noBorder={true} 
            onClick={() => handleVibeToggle(vibe)}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
};
