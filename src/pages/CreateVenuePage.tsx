
import React, { useState } from 'react';
import { CreateVenueForm, CreateVenueFormValues } from '@/components/venues/CreateVenueForm';
import { AppPageHeader } from '@/components/ui/AppPageHeader';
import { useToast } from '@/hooks/use-toast';

export default function CreateVenuePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: CreateVenueFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement venue creation logic
      console.log('Creating venue:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Venue created successfully!",
        description: "Your venue has been added to the platform.",
      });
    } catch (error) {
      toast({
        title: "Error creating venue",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AppPageHeader subtitle="Add a new venue to the platform">
        Create Venue
      </AppPageHeader>
      <div className="max-w-2xl mx-auto">
        <CreateVenueForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
