
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

  const displayText = selectedVibes.length === 0 ? "VIBE" : 
                    selectedVibes.length === 1 ? selectedVibes[0].toUpperCase() : 
                    `${selectedVibes.length} VIBES`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-ocean-deep/20 bg-coconut text-ocean-deep rounded-md font-mono text-xs font-medium uppercase tracking-wide hover:bg-vibrant-aqua/10 hover:border-vibrant-aqua/40 transition-all duration-200"
        >
          <Sparkles className="h-4 w-4 text-coral" />
          <span>{displayText}</span>
          {selectedVibes.length > 0 && (
            <span className="px-1.5 py-0.5 bg-sungold/20 text-ocean-deep rounded-full text-xs font-medium">
              {selectedVibes.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-ocean-deep/70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-ocean-deep/20 shadow-coastal rounded-md" align="start">
        <div className="py-2">
          {/* All Vibes option */}
          <button
            onClick={handleClearAll}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
              selectedVibes.length === 0 ? 'bg-sungold/20 font-medium text-ocean-deep' : 'text-ocean-deep'
            }`}
          >
            all vibes
          </button>
          
          {vibesLoading && (
            <div className="px-4 py-2 text-sm text-ocean-deep/70 font-mono uppercase tracking-wide">
              Loading vibes...
            </div>
          )}
          
          {!vibesLoading && vibes.map((vibe) => (
            <button
              key={vibe}
              onClick={() => handleVibeToggle(vibe)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
                selectedVibes.includes(vibe) ? 'bg-sungold/20 font-medium text-ocean-deep' : 'text-ocean-deep'
              }`}
            >
              {vibe}
            </button>
          ))}
          
          {!vibesLoading && vibes.length === 0 && (
            <div className="px-4 py-2 text-sm text-ocean-deep/70 font-mono uppercase tracking-wide">
              No vibes available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
