
import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface EnhancedVibeFilterProps {
  vibes: string[];
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  isLoading?: boolean;
  className?: string;
}

const getVibeStyles = (vibe: string, isSelected: boolean) => {
  const lowerVibe = vibe.toLowerCase();
  
  if (!isSelected) {
    return {
      background: 'bg-white',
      text: 'text-gray-600',
      border: 'border-gray-300',
      hover: 'hover:border-gray-400',
      opacity: 'opacity-80'
    };
  }

  const vibeStyles: Record<string, any> = {
    party: {
      background: 'bg-gradient-to-r from-[#F43F5E] to-[#FB7185]',
      text: 'text-white',
      pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
    },
    relaxed: {
      background: 'bg-gradient-to-r from-[#FF9E00] to-[#FFCA80]',
      text: 'text-[#7B3F00]',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
    },
    mindful: {
      background: 'bg-gradient-to-r from-[#10B981] to-[#6EE7B7]',
      text: 'text-[#064E3B]',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%)'
    },
    spiritual: {
      background: 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]',
      text: 'text-white',
      pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)'
    },
    active: {
      background: 'bg-gradient-to-r from-[#FF5722] to-[#FF9800]',
      text: 'text-white',
      pattern: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 70%)'
    },
    social: {
      background: 'bg-gradient-to-r from-[#9C27B0] to-[#BA68C8]',
      text: 'text-white',
      pattern: 'radial-gradient(circle at bottom left, rgba(255,255,255,0.15) 0%, transparent 70%)'
    },
    creative: {
      background: 'bg-gradient-to-r from-[#6366F1] to-[#A5B4FC]',
      text: 'text-white',
      pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)'
    },
    adventure: {
      background: 'bg-gradient-to-r from-[#059669] to-[#34D399]',
      text: 'text-white',
      pattern: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 70%)'
    },
    family: {
      background: 'bg-gradient-to-r from-[#8BC34A] to-[#CDDC39]',
      text: 'text-[#33691E]',
      pattern: 'radial-gradient(circle at top left, rgba(255,255,255,0.1) 0%, transparent 60%)'
    }
  };

  return vibeStyles[lowerVibe] || {
    background: 'bg-gradient-to-r from-gray-500 to-gray-600',
    text: 'text-white',
    pattern: 'none'
  };
};

export const EnhancedVibeFilter: React.FC<EnhancedVibeFilterProps> = ({
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

  const handleAllClick = () => {
    // If all vibes are selected OR no vibes are selected, deselect all
    // If some vibes are selected, select all
    if (selectedVibes.length === 0 || selectedVibes.length === vibes.length) {
      onVibeChange([]);
    } else {
      onVibeChange(vibes);
    }
  };

  const handleClearAll = () => {
    onVibeChange([]);
  };

  const isAllSelected = selectedVibes.length === vibes.length;
  const isNoneSelected = selectedVibes.length === 0;

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
        {selectedVibes.length > 0 && selectedVibes.length < vibes.length && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={handleAllClick}
          className={cn(
            "flex-shrink-0 rounded-full text-xs py-1 px-2 font-medium transition-all duration-200 border",
            isAllSelected || isNoneSelected
              ? "bg-black text-white border-black shadow-sm" 
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 opacity-80"
          )}
        >
          All
        </button>
        {vibes.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe);
          const styles = getVibeStyles(vibe, isSelected);
          
          return (
            <button
              key={vibe}
              onClick={() => handleVibeToggle(vibe)}
              className={cn(
                "flex-shrink-0 rounded-full text-xs py-1 px-2 font-medium transition-all duration-200 border capitalize relative overflow-hidden",
                isSelected ? styles.text : `${styles.text} ${styles.border} ${styles.hover} ${styles.opacity}`,
                isSelected ? styles.background : styles.background
              )}
              style={isSelected && styles.pattern !== 'none' ? {
                backgroundImage: `${styles.pattern}, linear-gradient(to right, var(--tw-gradient-stops))`
              } : {}}
            >
              {vibe}
            </button>
          );
        })}
      </div>
    </div>
  );
};
