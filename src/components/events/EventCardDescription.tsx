
import React from 'react';
import { cn } from '@/lib/utils';

interface EventCardDescriptionProps {
  description: string | null;
  compact?: boolean;
  className?: string;
}

export const EventCardDescription: React.FC<EventCardDescriptionProps> = ({ 
  description, 
  compact = false,
  className 
}) => {
  if (compact || !description) return null;
  
  return (
    <p className={cn("text-gray-700 line-clamp-2 font-inter leading-7", className)}>
      {description}
    </p>
  );
};
