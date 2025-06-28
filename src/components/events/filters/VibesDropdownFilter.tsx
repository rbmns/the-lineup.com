
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
          className="flex items-center gap-2 h-10 px-3 border-sage/40 bg-coconut text-midnight rounded-md font-mono text-xs font-medium hover:bg-sage/20 hover:border-sage/60 transition-all duration-200"
        >
          <Sparkles className="h-4 w-4 text-ocean-deep" />
          <span className="lowercase">{displayText}</span>
          {selectedVibes.length > 0 && (
            <span className="px-1.5 py-0.5 bg-ocean-deep/5 text-midnight/90 rounded-full text-xs font-medium">
              {selectedVibes.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-driftwood" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-sage/40 shadow-elevated rounded-md" align="start">
        <div className="py-2">
          {/* All Vibes option */}
          <button
            onClick={handleClearAll}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-sage/20 transition-colors font-mono ${
              selectedVibes.length === 0 ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-midnight'
            }`}
          >
            All Vibes
          </button>
          
          {vibesLoading && (
            <div className="px-4 py-2 text-sm text-driftwood font-mono">
              Loading vibes...
            </div>
          )}
          
          {!vibesLoading && vibes.map((vibe) => (
            <button
              key={vibe}
              onClick={() => handleVibeToggle(vibe)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-sage/20 transition-colors lowercase font-mono ${
                selectedVibes.includes(vibe) ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-midnight'
              }`}
            >
              {vibe}
            </button>
          ))}
          
          {!vibesLoading && vibes.length === 0 && (
            <div className="px-4 py-2 text-sm text-driftwood font-mono">
              No vibes available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
