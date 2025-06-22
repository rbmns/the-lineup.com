
import React from 'react';
import { cn } from '@/lib/utils';
import { getVibeColorClasses } from '@/utils/vibeColors';

interface EventVibeLabelProps {
  vibe: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EventVibeLabel: React.FC<EventVibeLabelProps> = ({ 
  vibe, 
  size = 'md',
  className 
}) => {
  if (!vibe) return null;

  return (
    <span 
      className={cn(
        getVibeColorClasses(vibe, true, size),
        "capitalize font-medium",
        className
      )}
    >
      {vibe}
    </span>
  );
};

export default EventVibeLabel;
