
import React, { useState, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import { VenueFilterItem } from './venue-filter/VenueFilterItem';
import { VenueFilterBadges } from './venue-filter/VenueFilterBadges';

interface VenueOption {
  value: string;
  label: string;
}

interface VenueFilterProps {
  venues: VenueOption[];
  selectedVenues: string[];
  onVenueChange: (venues: string[]) => void;
  onReset: () => void;
}

export const VenueFilter: React.FC<VenueFilterProps> = ({
  venues = [],
  selectedVenues = [],
  onVenueChange,
  onReset
}) => {
  // Ensure arrays are always defined
  const safeSelectedVenues = Array.isArray(selectedVenues) ? selectedVenues : [];
  const [venueMap, setVenueMap] = useState<Map<string, string>>(new Map());

  // Initialize venue map for quick lookups
  useEffect(() => {
    const map = new Map();
    
    venues.forEach(venue => {
      map.set(venue.value, venue.label);
    });
    
    setVenueMap(map);
  }, [venues]);

  const toggleVenue = (venue: string) => {
    if (safeSelectedVenues.includes(venue)) {
      onVenueChange(safeSelectedVenues.filter(v => v !== venue));
    } else {
      onVenueChange([...safeSelectedVenues, venue]);
    }
  };

  // Sort venues alphabetically by label
  const sortedVenues = [...venues].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="space-y-2">
      <Command className="rounded-md border shadow-none bg-white">
        <CommandList className="max-h-64">
          <CommandEmpty>No venue found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {sortedVenues.map((venue) => (
              <VenueFilterItem
                key={venue.value}
                value={venue.value}
                label={venue.label}
                isSelected={safeSelectedVenues.includes(venue.value)}
                onSelect={toggleVenue}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      
      <VenueFilterBadges
        selectedVenues={safeSelectedVenues}
        venueMap={venueMap}
        onRemove={toggleVenue}
      />
      
      {safeSelectedVenues.length > 0 && (
        <div className="flex justify-end mt-2">
          <button 
            className="text-xs text-gray-500 hover:text-gray-800"
            onClick={() => onVenueChange([])}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
