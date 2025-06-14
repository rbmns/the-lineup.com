
import React from 'react';
import { EventForm } from '@/components/events/EventForm';
import { CreatorGuard } from '@/components/auth/CreatorGuard';

const CreateEvent = () => {
  return (
    <CreatorGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Event</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create a new event for the community to discover and attend.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <EventForm />
        </div>
      </div>
    </CreatorGuard>
  );
};

export default CreateEvent;
