
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const EventDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image and title skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Location skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* RSVP buttons skeleton */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          
          {/* Attendees skeleton */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
