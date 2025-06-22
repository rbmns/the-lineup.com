
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationCategory } from '@/utils/locationCategories';

interface LocationFilterProps {
  availableLocations: LocationCategory[];
  selectedLocation: string | null;
  onLocationChange: (categoryId: string | null) => void;
  isLoading?: boolean;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  availableLocations,
  selectedLocation,
  onLocationChange,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </h3>
        {selectedLocation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLocationChange(null)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
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
            "text-xs px-3 py-1.5 h-auto rounded-full",
            selectedLocation === null 
              ? "bg-primary text-white" 
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          All Areas
        </Button>
        
        {availableLocations.map(category => (
          <Button
            key={category.id}
            variant={selectedLocation === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onLocationChange(category.id)}
            className={cn(
              "text-xs px-3 py-1.5 h-auto rounded-full",
              selectedLocation === category.id 
                ? "bg-primary text-white" 
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            {category.displayName}
          </Button>
        ))}
      </div>
    </div>
  );
};
