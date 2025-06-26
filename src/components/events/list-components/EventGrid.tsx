
import React from 'react';
import { cn } from '@/lib/utils';

interface EventGridProps {
  children: React.ReactNode;
  className?: string;
}

export const EventGrid: React.FC<EventGridProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
      className
    )}>
      {children}
    </div>
  );
};
