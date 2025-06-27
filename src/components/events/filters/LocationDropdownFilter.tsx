
import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LocationDropdownFilterProps {
  venueAreas: Array<{ id: string; name: string }>;
  selectedLocationId: string | null;
  onLocationChange: (locationId: string | null) => void;
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

  const selectedLocation = venueAreas.find(area => area.id === selectedLocationId);
  const displayText = selectedLocationId === null ? "Location" : selectedLocation?.name || "Location";

  const handleLocationSelect = (locationId: string | null) => {
    onLocationChange(locationId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-gray-300 rounded-lg"
        >
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium">{displayText}</span>
          {selectedLocationId && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              1
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="py-2">
          {/* All Areas option */}
          <button
            onClick={() => handleLocationSelect(null)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
              selectedLocationId === null ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
            }`}
          >
            All Areas
          </button>
          
          {/* Loading state */}
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Loading areas...
            </div>
          )}
          
          {/* Areas list */}
          {!isLoading && venueAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => handleLocationSelect(area.id)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                selectedLocationId === area.id ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'
              }`}
            >
              {area.name}
            </button>
          ))}
          
          {/* No areas found */}
          {!isLoading && venueAreas.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No areas available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
