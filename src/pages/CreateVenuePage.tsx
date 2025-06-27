
import React from 'react';
import { CreateVenueForm } from '@/components/venues/CreateVenueForm';
import { AppPageHeader } from '@/components/ui/AppPageHeader';

export default function CreateVenuePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AppPageHeader subtitle="Add a new venue to the platform">
        Create Venue
      </AppPageHeader>
      <div className="max-w-2xl mx-auto">
        <CreateVenueForm />
      </div>
    </div>
  );
}
