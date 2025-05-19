
import React from 'react';

interface EventCountDisplayProps {
  count: number;
  showMessage?: boolean;
}

export const EventCountDisplay: React.FC<EventCountDisplayProps> = ({ 
  count,
  showMessage = true
}) => {
  if (!showMessage) return null;
  
  return (
    <div className="mb-4 text-sm text-gray-600">
      {count} {count === 1 ? 'event' : 'events'} found
    </div>
  );
};
