
import React from 'react';

// Simple map placeholder component
interface EventMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export const EventMap: React.FC<EventMapProps> = ({ latitude, longitude, name }) => {
  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="text-center p-4">
        <p className="font-medium text-gray-600">{name}</p>
        <p className="text-sm text-gray-500">Map location: {latitude}, {longitude}</p>
        <p className="text-xs text-gray-400 mt-2">Map implementation coming soon</p>
      </div>
    </div>
  );
};
