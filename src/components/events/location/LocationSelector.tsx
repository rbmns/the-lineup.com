
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users } from 'lucide-react';
import { LocationCategory } from '@/utils/locationCategories';
import { Event } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationSelectorProps {
  availableAreas: LocationCategory[];
  selectedAreaId: string | null;
  onAreaChange: (areaId: string | null) => void;
  events: Event[];
  isLoading?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  availableAreas,
  selectedAreaId,
  onAreaChange,
  events,
  isLoading = false
}) => {
  const isMobile = useIsMobile();

  // Count events per area
  const getEventCountForArea = (areaId: string): number => {
    if (!events || events.length === 0) return 0;
    
    const area = availableAreas.find(a => a.id === areaId);
    if (!area) return 0;
    
    return events.filter(event => {
      const eventCity = event.venues?.city || event.location;
      if (!eventCity) return false;
      
      return area.cities.some(city => 
        city.toLowerCase() === eventCity.toLowerCase()
      );
    }).length;
  };

  const totalEvents = events?.length || 0;
  const selectedArea = availableAreas.find(a => a.id === selectedAreaId);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Choose your area to see relevant events
          </span>
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 items-start`}>
          <Select
            value={selectedAreaId || 'all'}
            onValueChange={(value) => onAreaChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-64'} bg-white border-gray-200`}>
              <SelectValue placeholder="Select your area..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              <SelectItem value="all" className="hover:bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <span>All Areas</span>
                  <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {totalEvents}
                  </span>
                </div>
              </SelectItem>
              {availableAreas.map(area => {
                const eventCount = getEventCountForArea(area.id);
                return (
                  <SelectItem key={area.id} value={area.id} className="hover:bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <span>{area.displayName}</span>
                      <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {eventCount}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {selectedAreaId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAreaChange(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear
            </Button>
          )}
        </div>
        
        {selectedArea && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing events in {selectedArea.displayName}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {getEventCountForArea(selectedArea.id)} events
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
