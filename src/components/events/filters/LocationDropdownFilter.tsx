
import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface VenueArea {
  id: string;
  name: string;
  cities?: string[];
}

interface LocationDropdownFilterProps {
  venueAreas: VenueArea[];
  selectedLocationId: string | null;
  onLocationChange: (id: string | null) => void;
  isLoading: boolean;
  isLocationLoaded: boolean;
}

export const LocationDropdownFilter: React.FC<LocationDropdownFilterProps> = ({
  venueAreas,
  selectedLocationId,
  onLocationChange,
  isLoading,
  isLocationLoaded
}) => {
  const [open, setOpen] = useState(false);

  const handleLocationSelect = (locationId: string | null) => {
    onLocationChange(locationId);
    setOpen(false);
  };

  const selectedArea = venueAreas.find(area => area.id === selectedLocationId);
  const displayText = selectedArea ? selectedArea.name : "Location";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-ocean-deep/20 bg-coconut text-ocean-deep rounded-md font-mono text-xs font-medium uppercase tracking-wide hover:bg-vibrant-aqua/10 hover:border-vibrant-aqua/40 transition-all duration-200"
        >
          <MapPin className="h-4 w-4 text-vibrant-aqua" />
          <span>{displayText}</span>
          {selectedLocationId && (
            <span className="px-1.5 py-0.5 bg-vibrant-aqua/20 text-ocean-deep rounded-full text-xs font-medium">
              1
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-ocean-deep/70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-coconut border-ocean-deep/20 shadow-coastal rounded-md" align="start">
        <div className="py-2">
          {/* All Locations option */}
          <button
            onClick={() => handleLocationSelect(null)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
              !selectedLocationId ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-ocean-deep'
            }`}
          >
            all locations
          </button>
          
          {isLoading && (
            <div className="px-4 py-2 text-sm text-ocean-deep/70 font-mono uppercase tracking-wide">
              Loading locations...
            </div>
          )}
          
          {!isLoading && venueAreas.length > 0 && (
            <>
              {/* Divider */}
              <div className="border-t border-ocean-deep/10 my-1" />
              
              {/* Location areas */}
              {venueAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleLocationSelect(area.id)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
                    selectedLocationId === area.id ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-ocean-deep'
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </>
          )}
          
          {!isLoading && venueAreas.length === 0 && (
            <div className="px-4 py-2 text-sm text-ocean-deep/70 font-mono uppercase tracking-wide">
              No locations available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
