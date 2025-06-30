
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { VenueArea } from '@/types';
import { cn } from '@/lib/utils';

interface LocationDropdownFilterProps {
  venueAreas: VenueArea[];
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedArea = venueAreas.find(area => area.id === selectedLocationId);
  const displayText = selectedArea ? selectedArea.name : 'All Locations';

  const handleLocationSelect = (locationId: string | null) => {
    onLocationChange(locationId);
    setIsOpen(false);
  };

  if (isLoading || !isLocationLoaded) {
    return (
      <div className="relative">
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md font-mono text-xs uppercase tracking-wide"
          disabled
        >
          <MapPin className="h-3.5 w-3.5" />
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md",
          "font-mono text-xs uppercase tracking-wide text-gray-700",
          "hover:bg-gray-50 hover:border-gray-300 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          selectedLocationId && "border-blue-300 bg-blue-50 text-blue-700"
        )}
      >
        <MapPin className="h-3.5 w-3.5" />
        <span className="truncate max-w-[120px]">{displayText}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform flex-shrink-0",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="py-1">
            <button
              onClick={() => handleLocationSelect(null)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                "font-mono uppercase tracking-wide",
                !selectedLocationId ? "bg-blue-50 text-blue-700" : "text-gray-700"
              )}
            >
              All Locations
            </button>
            
            {venueAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => handleLocationSelect(area.id)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                  "font-mono uppercase tracking-wide",
                  selectedLocationId === area.id ? "bg-blue-50 text-blue-700" : "text-gray-700"
                )}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
