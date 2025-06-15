
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateVenueForm } from './CreateVenueForm';
import { createVenue, updateVenue } from '@/lib/venueService';
import { CreateVenueFormValues } from './CreateVenueSchema';
import { toast } from 'sonner';
import { Venue } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface CreateVenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (venue: Venue) => void;
  venueToEdit?: Venue | null;
}

export const CreateVenueModal: React.FC<CreateVenueModalProps> = ({ open, onOpenChange, onComplete, venueToEdit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isEditMode = !!venueToEdit;

  const handleFormSubmit = async (formData: CreateVenueFormValues) => {
    if (!user) {
      toast.error("You must be logged in to manage venues.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode && venueToEdit) {
        const { data: updatedVenue, error } = await updateVenue(venueToEdit.id, formData);
        if (error || !updatedVenue) {
          throw error || new Error("Failed to update venue.");
        }
        toast.success(`Venue "${updatedVenue.name}" updated successfully!`);
        onComplete(updatedVenue);
      } else {
        const venueData = { ...formData, creator_id: user.id };
        const { data: newVenue, error } = await createVenue(venueData);
        if (error || !newVenue) {
          throw error || new Error("Failed to create venue.");
        }
        toast.success(`Venue "${newVenue.name}" created successfully!`);
        onComplete(newVenue);
      }
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save venue", error);
      if (error?.code === '23505' && error?.message?.includes('venues_name_key')) {
        toast.error("A venue with this name already exists. Please use a different name.");
      } else {
        toast.error("Failed to save venue. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Venue' : 'Create a New Venue'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details for this venue.' : 'Add a new venue to the list. This will be available for all event creators.'}
          </DialogDescription>
        </DialogHeader>
        <CreateVenueForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} venue={venueToEdit} />
      </DialogContent>
    </Dialog>
  );
};
