
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateVenueForm } from './CreateVenueForm';
import { createVenue } from '@/lib/venueService';
import { CreateVenueFormValues } from './CreateVenueSchema';
import { toast } from 'sonner';
import { Venue } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface CreateVenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVenueCreated: (venue: Venue) => void;
}

export const CreateVenueModal: React.FC<CreateVenueModalProps> = ({ open, onOpenChange, onVenueCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleCreateVenue = async (formData: CreateVenueFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a venue.");
      return;
    }
    setIsSubmitting(true);
    try {
      const venueData = { ...formData, creator_id: user.id };
      const { data: newVenue, error } = await createVenue(venueData);
      if (error || !newVenue) {
        throw error || new Error("Failed to create venue.");
      }
      toast.success(`Venue "${newVenue.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      onVenueCreated(newVenue);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create venue", error);
      toast.error("Failed to create venue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Venue</DialogTitle>
          <DialogDescription>
            Add a new venue to the list. This will be available for all event creators.
          </DialogDescription>
        </DialogHeader>
        <CreateVenueForm onSubmit={handleCreateVenue} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};
