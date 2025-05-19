
import React from 'react';

interface EventCountDisplayProps {
  count: number;
}

export const EventCountDisplay: React.FC<EventCountDisplayProps> = ({ count }) => {
  return (
    <div className="text-sm text-gray-500 mb-4">
      {count} {count === 1 ? 'event' : 'events'} found
    </div>
  );
};
