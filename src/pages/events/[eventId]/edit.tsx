
import React from 'react';
import { useParams } from 'react-router-dom';
import { EventForm } from '@/components/events/EventForm';

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Edit Event</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Update your event details and information.
        </p>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <EventForm eventId={eventId} isEditMode={true} />
      </div>
    </div>
  );
};

export default EditEvent;
