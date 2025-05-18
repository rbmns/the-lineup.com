
import React from 'react';

interface EventCountDisplayProps {
  count: number;
  className?: string;
}

export const EventCountDisplay: React.FC<EventCountDisplayProps> = ({ 
  count, 
  className = "text-sm text-gray-600 mb-4" 
}) => {
  return (
    <div className={className}>
      {count} {count === 1 ? 'event' : 'events'} found
    </div>
  );
};
