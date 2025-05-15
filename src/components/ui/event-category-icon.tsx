
import React from 'react';
import { EventTypeIcon } from './EventTypeIcon';

interface EventCategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EventCategoryIcon: React.FC<EventCategoryIconProps> = ({ 
  category, 
  size = 'md',
  className = '' 
}) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];
  
  return <EventTypeIcon eventType={category} className={`${sizeClass} ${className}`} />;
};
