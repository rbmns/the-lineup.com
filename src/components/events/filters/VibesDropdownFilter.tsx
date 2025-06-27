
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

  const displayText = selectedVibes.length === 0 
    ? 'Vibes' 
    : selectedVibes.length === 1 
      ? selectedVibes[0] 
      : `${selectedVibes.length} vibes`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-gray-300 rounded-lg"
        >
          <span className="text-sm font-medium">{displayText}</span>
          {selectedVibes.length > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {selectedVibes.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Select Vibes</h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onVibeChange([])}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all font-medium ${
                selectedVibes.length === 0
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              All
            </button>
            {vibes.map((vibe) => (
              <button
                key={vibe}
                onClick={() => {
                  const newVibes = selectedVibes.includes(vibe)
                    ? selectedVibes.filter(v => v !== vibe)
                    : [...selectedVibes, vibe];
                  onVibeChange(newVibes);
                }}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all capitalize font-medium ${
                  selectedVibes.includes(vibe)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
