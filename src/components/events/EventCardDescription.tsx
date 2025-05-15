
import React from 'react';

interface EventCardDescriptionProps {
  description: string | null;
  compact?: boolean;
}

export const EventCardDescription: React.FC<EventCardDescriptionProps> = ({ 
  description, 
  compact = false 
}) => {
  if (compact || !description) return null;
  
  return (
    <p className="text-gray-700 line-clamp-2 font-inter leading-7">
      {description}
    </p>
  );
};
