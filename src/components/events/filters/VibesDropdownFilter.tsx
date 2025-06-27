
import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Event } from '@/types';

interface VibesDropdownFilterProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  events: Event[];
  vibesLoading: boolean;
}

export const VibesDropdownFilter: React.FC<VibesDropdownFilterProps> = ({
  selectedVibes,
  onVibeChange,
  events,
  vibesLoading
}) => {
  const [open, setOpen] = useState(false);

  // Extract unique vibes from events
  const vibes = [...new Set(events.map(event => event.vibe).filter(Boolean))] as string[];

  const handleVibeToggle = (vibe: string) => {
    const newVibes = selectedVibes.includes(vibe)
      ? selectedVibes.filter(v => v !== vibe)
      : [...selectedVibes, vibe];
    onVibeChange(newVibes);
  };

  const handleClearAll = () => {
    onVibeChange([]);
  };

  const displayText = selectedVibes.length === 0 ? "Vibes" : 
                    selectedVibes.length === 1 ? selectedVibes[0] : 
                    `${selectedVibes.length} vibes`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-sage bg-coconut text-midnight rounded-sm font-mono text-sm hover:bg-seafoam hover:border-overcast transition-colors"
        >
          <Sparkles className="h-4 w-4 text-gray-400" />
          <span className="capitalize">{displayText}</span>
          {selectedVibes.length > 0 && (
            <span className="px-1.5 py-0.5 bg-seafoam text-midnight rounded-full text-xs font-medium">
              {selectedVibes.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-sage" align="start">
        <div className="py-2">
          {/* All Vibes option */}
          <button
            onClick={handleClearAll}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-seafoam transition-colors font-mono ${
              selectedVibes.length === 0 ? 'bg-seafoam font-medium text-midnight' : 'text-midnight'
            }`}
          >
            All Vibes
          </button>
          
          {/* Loading state */}
          {vibesLoading && (
            <div className="px-4 py-2 text-sm text-gray-500 font-mono">
              Loading vibes...
            </div>
          )}
          
          {/* Vibes list */}
          {!vibesLoading && vibes.map((vibe) => (
            <button
              key={vibe}
              onClick={() => handleVibeToggle(vibe)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-seafoam transition-colors capitalize font-mono ${
                selectedVibes.includes(vibe) ? 'bg-seafoam font-medium text-midnight' : 'text-midnight'
              }`}
            >
              {vibe}
            </button>
          ))}
          
          {/* No vibes found */}
          {!vibesLoading && vibes.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 font-mono">
              No vibes available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
