
import React from 'react';
import { EventForm } from '@/components/events/EventForm';
import { useIsMobile } from '@/hooks/use-mobile';

const CreateEvent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full">
      {/* More compact mobile container */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className={`mb-4 sm:mb-6 lg:mb-8 ${isMobile ? 'px-2' : ''}`}>
            <h1 className={`font-bold tracking-tight mb-3 sm:mb-2 ${isMobile ? 'text-2xl' : 'text-xl sm:text-2xl lg:text-3xl'}`}>
              Create Event
            </h1>
            <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-lg px-1 mb-4' : 'text-sm sm:text-base lg:text-lg'}`}>
              Share your event with the community and bring people together.
            </p>
          </div>
          
          {/* More compact form container */}
          <div className="bg-white rounded-lg border shadow-sm p-2 sm:p-4 lg:p-6">
            <EventForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
