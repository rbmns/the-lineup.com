
import React from 'react';
import { EventForm } from '@/components/events/EventForm';

const CreateEvent = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Mobile-optimized container with minimal padding */}
      <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">Create Event</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Share your event with the community and bring people together.
            </p>
          </div>
          
          {/* Mobile-optimized form container */}
          <div className="bg-white rounded-lg border shadow-sm p-3 sm:p-4 lg:p-6">
            <EventForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
