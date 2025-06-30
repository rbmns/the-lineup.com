
import React from 'react';
import { EventForm } from '@/components/events/EventForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const CreateEvent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-pure-white">
      {/* Header Section */}
      <div className={cn(
        "section-content text-center",
        isMobile ? "py-4 px-4" : "py-12"
      )}>
        <h1 className={cn(
          "text-graphite-grey mb-2",
          isMobile ? "text-2xl font-bold" : "text-h1"
        )}>
          Create Event
        </h1>
        <p className={cn(
          "text-graphite-grey mx-auto",
          isMobile ? "text-sm max-w-xs" : "text-body-base max-w-2xl"
        )}>
          Share your event with the community
        </p>
      </div>
      
      {/* Form Container */}
      <div className={cn(
        "mx-auto pb-8",
        isMobile ? "px-4 max-w-full" : "px-8 max-w-4xl"
      )}>
        <div className={cn(
          "bg-white rounded-lg border border-mist-grey",
          isMobile ? "p-4" : "p-8"
        )}>
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
