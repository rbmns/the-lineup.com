
import React from 'react';
import { EventForm } from '@/components/events/EventForm';

const CreateEvent = () => {
  return (
    <div className="min-h-screen w-full">
      {/* More compact mobile container */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2">Create Event</h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
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
