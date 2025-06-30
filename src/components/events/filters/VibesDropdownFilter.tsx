
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';

interface VibesDropdownFilterProps {
  selectedVibes: string[];
  onVibeChange: (vibes: string[]) => void;
  events: Event[];
  vibesLoading?: boolean;
}

export const VibesDropdownFilter: React.FC<VibesDropdownFilterProps> = ({
  selectedVibes,
  onVibeChange,
  events,
  vibesLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract unique vibes from events
  const availableVibes = Array.from(
    new Set(events.map(event => event.vibe).filter(Boolean))
  ).sort();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVibeToggle = (vibe: string) => {
    const newVibes = selectedVibes.includes(vibe)
      ? selectedVibes.filter(v => v !== vibe)
      : [...selectedVibes, vibe];
    onVibeChange(newVibes);
  };

  const displayText = selectedVibes.length > 0 
    ? `Vibes (${selectedVibes.length})`
    : 'Vibes';

  if (vibesLoading) {
    return (
      <div className="relative">
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md font-mono text-xs uppercase tracking-wide"
          disabled
        >
          <Sparkles className="h-3.5 w-3.5" />
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md",
          "font-mono text-xs uppercase tracking-wide text-gray-700",
          "hover:bg-gray-50 hover:border-gray-300 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          selectedVibes.length > 0 && "border-blue-300 bg-blue-50 text-blue-700"
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{displayText}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="py-1">
            {availableVibes.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 font-mono">
                No vibes available
              </div>
            ) : (
              availableVibes.map((vibe) => (
                <label
                  key={vibe}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedVibes.includes(vibe)}
                    onChange={() => handleVibeToggle(vibe)}
                    className="mr-3 rounded"
                  />
                  <span className="text-sm font-mono uppercase tracking-wide text-gray-700">
                    {vibe}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
