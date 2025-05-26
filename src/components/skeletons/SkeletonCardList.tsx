
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardListProps {
  count?: number;
}

export const SkeletonCardList: React.FC<SkeletonCardListProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-row gap-4 sm:h-24 rounded-lg shadow-sm overflow-hidden bg-white">
          {/* Image skeleton */}
          <div className="relative h-[100px] sm:h-auto sm:w-[120px] overflow-hidden">
            <Skeleton className="h-full w-full" />
            {/* Event type pill skeleton */}
            <div className="absolute top-2 left-2">
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="flex flex-col flex-1 p-3 justify-between">
            {/* Title */}
            <Skeleton className="h-5 w-3/4 mb-2" />
            
            {/* Date and time */}
            <Skeleton className="h-3 w-1/2 mb-2" />
            
            {/* Bottom row with location and buttons */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-1/3" />
              
              {/* RSVP buttons */}
              <div className="flex gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
