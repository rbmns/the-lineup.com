
import React from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface LocationDropdownFilterProps {
  venueAreas: Array<{ id: string; name: string; cities?: string[] }>;
  selectedLocationId: string | null;
  onLocationChange: (locationId: string | null) => void;
  isLoading?: boolean;
  isLocationLoaded?: boolean;
}

export const LocationDropdownFilter: React.FC<LocationDropdownFilterProps> = ({
  venueAreas,
  selectedLocationId,
  onLocationChange,
  isLoading = false,
  isLocationLoaded = true
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedArea = selectedLocationId ? venueAreas.find(area => area.id === selectedLocationId) : null;
  const displayValue = selectedArea ? selectedArea.name : 'All Locations';

  const handleSelect = (value: string) => {
    if (value === 'all-locations') {
      onLocationChange(null);
    } else {
      onLocationChange(value === selectedLocationId ? null : value);
    }
    setOpen(false);
  };

  if (isLoading || !isLocationLoaded) {
    return (
      <Button 
        variant="outline" 
        className="w-full sm:w-auto justify-between bg-coconut border-sage text-ocean-deep hover:bg-sage/30 hover:text-ocean-deep"
        disabled
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Loading...</span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-auto justify-between bg-coconut border-sage text-ocean-deep hover:bg-sage/30 hover:text-ocean-deep"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{displayValue}</span>
            {selectedLocationId && (
              <span className="ml-1 px-1.5 py-0.5 bg-sungold/30 text-ocean-deep rounded-full text-xs font-medium">
                1
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-coconut border-sage">
        <Command>
          <CommandInput placeholder="Search locations..." className="text-ocean-deep" />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value="all-locations"
              onSelect={() => handleSelect('all-locations')}
              className="hover:bg-sage/30 text-ocean-deep"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedLocationId ? "opacity-100" : "opacity-0"
                )}
              />
              All Locations
            </CommandItem>
            {venueAreas.map((area) => (
              <CommandItem
                key={area.id}
                value={area.id}
                onSelect={() => handleSelect(area.id)}
                className="hover:bg-sage/30 text-ocean-deep"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLocationId === area.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{area.name}</span>
                  {area.cities && area.cities.length > 0 && (
                    <span className="text-xs text-ocean-deep/60">
                      {area.cities.slice(0, 3).join(', ')}
                      {area.cities.length > 3 && ` +${area.cities.length - 3} more`}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
