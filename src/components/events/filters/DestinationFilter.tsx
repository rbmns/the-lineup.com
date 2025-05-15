
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useEventNavigation } from '@/hooks/useEventNavigation';

interface DestinationFilterProps {
  availableDestinations?: string[];
  selectedDestination?: string;
  onDestinationChange?: (destination: string) => void;
}

export const DestinationFilter: React.FC<DestinationFilterProps> = ({
  availableDestinations = [],
  selectedDestination,
  onDestinationChange
}) => {
  const { navigateToDestinationEvents } = useEventNavigation();

  // Note: This component is prepared for future implementation of destination filters
  // Currently it's a placeholder for the filter functionality we'll add later
  
  const handleDestinationClick = (destination: string) => {
    if (onDestinationChange) {
      onDestinationChange(destination);
    } else {
      // Navigate to filtered events by destination
      navigateToDestinationEvents(destination);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium flex items-center gap-1">
        <MapPin className="h-4 w-4" /> Destinations
      </h3>
      
      <div className="space-y-1">
        {availableDestinations.length > 0 ? (
          availableDestinations.map(destination => (
            <Button
              key={destination}
              variant={selectedDestination === destination ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleDestinationClick(destination)}
            >
              {destination}
            </Button>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No destinations available</p>
        )}
      </div>
    </div>
  );
};
