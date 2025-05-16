
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface EventsLoadingStateProps {
  compact?: boolean;
}

export const EventsLoadingState: React.FC<EventsLoadingStateProps> = ({ compact = false }) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="rounded-lg overflow-hidden shadow-sm">
          {/* Image skeleton */}
          <Skeleton className="w-full h-48" />
          
          {/* Content skeleton */}
          <div className="p-4">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            
            {/* Button skeleton */}
            <div className="flex justify-between mt-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
