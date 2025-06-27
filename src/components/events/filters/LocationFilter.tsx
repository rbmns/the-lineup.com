
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationCategory } from '@/utils/locationCategories';
import { useIsMobile } from '@/hooks/use-mobile';
import { Event } from '@/types';

interface LocationFilterProps {
  availableLocations: LocationCategory[];
  selectedLocation: string | null;
  onLocationChange: (areaId: string | null) => void;
  isLoading?: boolean;
  events?: Event[];
  showTitle?: boolean;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  availableLocations,
  selectedLocation,
  onLocationChange,
  isLoading = false,
  events = [],
  showTitle = true
}) => {
  const isMobile = useIsMobile();

  // Filter locations to only show those that have events
  const locationsWithEvents = React.useMemo(() => {
    if (!events || events.length === 0) return availableLocations;
    
    return availableLocations.filter(area => {
      const citiesInArea = area.cities;
      return events.some(event => {
        if (!event.venues?.city && !event.location) return false;
        
        // Skip events with "TBD" or similar in location
        if (event.location && (
          event.location.toLowerCase().includes('tbd') || 
          event.location.toLowerCase().includes('to be determined') ||
          event.location.toLowerCase().includes('location tbd')
        )) {
          return false;
        }
        
        const eventCity = event.venues?.city || event.location;
        return eventCity && citiesInArea.some(city => 
          city.toLowerCase() === eventCity.toLowerCase()
        );
      });
    });
  }, [availableLocations, events]);

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {showTitle && (
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-semibold tracking-tight text-primary`}>Location</h2>
        )}
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${isMobile ? 'h-9 w-24' : 'h-8 w-20'} bg-gray-200 rounded-full animate-pulse`}></div>
          ))}
        </div>
      </div>
    );
  }

  // Always show the filter section, even if no areas have events yet
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-semibold tracking-tight text-primary`}>Location</h2>
          {selectedLocation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLocationChange(null)}
              className="h-6 w-6 p-0 hover:bg-primary/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedLocation === null ? "default" : "outline"}
          size="sm"
          onClick={() => onLocationChange(null)}
          className={cn(
            isMobile ? "text-xs px-3 py-2 h-9" : "text-xs px-3 py-1.5 h-auto",
            "rounded-full transition-coastal",
            selectedLocation === null 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "border-gray-200 text-neutral hover:bg-primary/5"
          )}
        >
          All Areas
        </Button>
        
        {availableLocations.map(area => (
          <Button
            key={area.id}
            variant={selectedLocation === area.id ? "default" : "outline"}
            size="sm"
            onClick={() => onLocationChange(area.id)}
            className={cn(
              isMobile ? "text-xs px-3 py-2 h-9" : "text-xs px-3 py-1.5 h-auto",
              "rounded-full transition-coastal",
              selectedLocation === area.id 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "border-gray-200 text-neutral hover:bg-primary/5"
            )}
          >
            {area.displayName}
          </Button>
        ))}
      </div>
    </div>
  );
};
