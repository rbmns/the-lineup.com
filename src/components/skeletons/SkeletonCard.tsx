
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm bg-white flex flex-col h-full">
      {/* Image placeholder with aspect ratio */}
      <div className="aspect-[16/9] relative">
        <Skeleton className="h-full w-full" />
        {/* Category pill skeleton */}
        <div className="absolute top-3 left-3 z-10">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      
      {/* Content placeholder */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <Skeleton className="h-6 w-full mb-2" />
        
        {/* Date */}
        <Skeleton className="h-4 w-3/4 mb-2" />
        
        {/* Location */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Spacer */}
        <div className="flex-grow min-h-[24px]"></div>
        
        {/* RSVP buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
};
