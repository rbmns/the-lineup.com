
import React from 'react';
import { EventForm } from '@/components/events/EventForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const CreateEvent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-pure-white">
      {/* Header Section using global section-content */}
      <div className={cn(
        "section-content text-center",
        isMobile ? "py-8" : "py-12"
      )}>
        <h1 className="text-h1 text-primary mb-4">
          Create Event
        </h1>
        <p className="text-body-base text-graphite-grey max-w-2xl mx-auto">
          Share your event with the community and bring people together.
        </p>
      </div>
      
      {/* Form Container using global design system */}
      <div className="section-content-narrow">
        <div className="card-base">
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
