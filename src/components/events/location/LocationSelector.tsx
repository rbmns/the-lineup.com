
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

  // Count events per area - don't filter out areas without events
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
      <div className="bg-[#F9F3E9] border border-blue-100 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  console.log('LocationSelector - Available areas:', availableAreas);
  console.log('LocationSelector - Selected area ID:', selectedAreaId);

  return (
    <div className="bg-[#F9F3E9] border border-[#E8DCC6] rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#005F73]" />
          <span className="text-sm font-medium text-[#003840]">
            Choose your area to see relevant events
          </span>
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 items-start`}>
          <Select
            value={selectedAreaId || 'all'}
            onValueChange={(value) => {
              console.log('LocationSelector - Value selected:', value);
              const newValue = value === 'all' ? null : value;
              onAreaChange(newValue);
            }}
          >
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-64'} bg-white border-[#E8DCC6]`}>
              <SelectValue placeholder="Select your area..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#E8DCC6] shadow-lg z-50">
              <SelectItem value="all" className="hover:bg-[#F9F3E9]">
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
                console.log(`LocationSelector - Area ${area.displayName} (${area.id}) has ${eventCount} events`);
                return (
                  <SelectItem key={area.id} value={area.id} className="hover:bg-[#F9F3E9]">
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
              className="text-[#003840] hover:text-[#005F73]"
            >
              Clear
            </Button>
          )}
        </div>
        
        {selectedArea && (
          <div className="flex items-center gap-2 text-sm text-[#003840]">
            <span>Showing events in {selectedArea.displayName}</span>
            <span className="px-2 py-1 bg-[#005F73] text-white rounded-full text-xs font-medium">
              {getEventCountForArea(selectedArea.id)} events
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
