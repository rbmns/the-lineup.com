
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VenueFilterBadgesProps {
  selectedVenues: string[];
  venueMap: Map<string, string>;
  onRemove: (venue: string) => void;
}

export const VenueFilterBadges: React.FC<VenueFilterBadgesProps> = ({
  selectedVenues,
  venueMap,
  onRemove,
}) => {
  if (selectedVenues.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {selectedVenues.map(venue => {
        const venueLabel = venueMap.get(venue) || venue;
        return (
          <Badge 
            key={venue} 
            variant="secondary"
            className="text-xs py-0.5 flex items-center"
          >
            {venueLabel}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(venue);
              }} 
            />
          </Badge>
        );
      })}
    </div>
  );
};
