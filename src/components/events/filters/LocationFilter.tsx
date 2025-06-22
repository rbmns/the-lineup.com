
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationCategory, getCitiesForCategory } from '@/utils/locationCategories';
import { useIsMobile } from '@/hooks/use-mobile';
import { Event } from '@/types';

interface LocationFilterProps {
  availableLocations: LocationCategory[];
  selectedLocation: string | null;
  onLocationChange: (categoryId: string | null) => void;
  isLoading?: boolean;
  events?: Event[];
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  availableLocations,
  selectedLocation,
  onLocationChange,
  isLoading = false,
  events = []
}) => {
  const isMobile = useIsMobile();

  // Filter locations to only show those that have events
  const locationsWithEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return availableLocations.filter(category => {
      const citiesInCategory = getCitiesForCategory(category.id);
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
        return eventCity && citiesInCategory.some(city => 
          city.toLowerCase() === eventCity.toLowerCase()
        );
      });
    });
  }, [availableLocations, events]);

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-semibold tracking-tight text-primary`}>Location</h2>
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${isMobile ? 'h-9 w-24' : 'h-8 w-20'} bg-gray-200 rounded-full animate-pulse`}></div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no locations have events
  if (locationsWithEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
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
        
        {locationsWithEvents.map(category => (
          <Button
            key={category.id}
            variant={selectedLocation === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onLocationChange(category.id)}
            className={cn(
              isMobile ? "text-xs px-3 py-2 h-9" : "text-xs px-3 py-1.5 h-auto",
              "rounded-full transition-coastal",
              selectedLocation === category.id 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "border-gray-200 text-neutral hover:bg-primary/5"
            )}
          >
            {category.displayName}
          </Button>
        ))}
      </div>
    </div>
  );
};
