
import React from 'react';

interface EventCountDisplayProps {
  count: number;
  hidden?: boolean;
}

export const EventCountDisplay: React.FC<EventCountDisplayProps> = ({ count, hidden = false }) => {
  if (hidden) return null;
  
  return (
    <div className="text-sm text-gray-500 mb-4">
      {count} {count === 1 ? 'event' : 'events'} found
    </div>
  );
};
