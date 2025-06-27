
import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LocationFilter } from '@/components/events/filters/LocationFilter';

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
        <div className="p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Location</h4>
          <LocationFilter
            venueAreas={venueAreas}
            selectedLocationId={selectedLocationId}
            onLocationChange={(locationId) => {
              onLocationChange(locationId);
              setOpen(false);
            }}
            isLoading={isLoading}
            isLocationLoaded={isLocationLoaded}
            className="w-full"
            compact={true}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
