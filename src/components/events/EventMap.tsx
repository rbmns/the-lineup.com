
import React from 'react';
import { MapPin } from 'lucide-react';

interface EventMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export const EventMap: React.FC<EventMapProps> = ({ latitude, longitude, name }) => {
  // For now, we'll create a placeholder component that can be improved later
  // with actual map integration
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
      <MapPin className="h-8 w-8 text-purple-600 mb-2" />
      <h3 className="font-medium text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600">
        Located at {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
      <p className="mt-2 text-xs text-gray-500">Interactive map would be displayed here</p>
    </div>
  );
};

export default EventMap;
