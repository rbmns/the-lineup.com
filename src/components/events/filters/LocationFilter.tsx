import React, { useState } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationFilterProps {
  venueAreas: Array<{ id: string; name: string }>;
  selectedLocationId: string | null;
  onLocationChange: (locationId: string | null) => void;
  isLoading: boolean;
  isLocationLoaded: boolean;
  className?: string;
  compact?: boolean;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  venueAreas,
  selectedLocationId,
  onLocationChange,
  isLoading,
  isLocationLoaded,
  className,
  compact = false
}) => {
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Find the selected location name
  const selectedLocation = venueAreas.find(area => area.id === selectedLocationId);
  const displayValue = selectedLocationId === null ? "All Areas" : selectedLocation?.name || "Select location...";

  // Create options with "All Areas" first
  const locationOptions = [
    { id: null, name: "All Areas" },
    ...venueAreas
  ];

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 text-sm"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{displayValue}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
          <Command>
            <CommandInput placeholder="Search locations..." />
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locationOptions.map((location) => (
                <CommandItem
                  key={location.id || 'all-areas'}
                  value={location.name}
                  onSelect={() => {
                    onLocationChange(location.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLocationId === location.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{displayValue}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search locations..." />
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locationOptions.map((location) => (
                <CommandItem
                  key={location.id || 'all-areas'}
                  value={location.name}
                  onSelect={() => {
                    onLocationChange(location.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLocationId === location.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
