
import React from 'react';
import { MapPin } from 'lucide-react';

interface EventMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export const EventMap: React.FC<EventMapProps> = ({ latitude, longitude, name }) => {
  // This is a placeholder component for the event map
  // In a real implementation, you would use a map library like Leaflet or Mapbox
  
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
      <MapPin className="h-8 w-8 text-red-500 mb-2" />
      <div className="text-center px-4">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-600">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Map view is a placeholder. See the actual location on map in a live implementation.
        </p>
      </div>
    </div>
  );
};

export default EventMap;
