
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const EventDetailLoadingState = () => {
  return (
    <div className="container py-8">
      {/* Back button skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="w-full md:w-2/3">
          <Card>
            {/* Image skeleton */}
            <Skeleton className="w-full aspect-[3/2] md:aspect-[16/9] rounded-none" />
            
            <CardContent className="p-6 space-y-6">
              {/* Title skeleton (mobile only) */}
              <div className="md:hidden space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              
              {/* Meta info skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2 pt-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              
              {/* Attendees skeleton */}
              <Card>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Mobile info cards */}
              <div className="md:hidden space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <Skeleton className="h-5 w-40 mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {/* Related events skeleton */}
          <div className="mt-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i}>
                  <Skeleton className="w-full h-40" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="hidden md:block md:w-1/3 space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
          
          {/* RSVP buttons skeleton */}
          <div className="mt-4">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
      
      {/* Mobile RSVP buttons skeleton */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};
