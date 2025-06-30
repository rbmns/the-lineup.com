
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
    console.log("Venue form submitted with data:", formData);
    
    setIsSubmitting(true);
    
    try {
      let savedVenue: Venue;
      
      if (isEditMode && venueToEdit) {
        // Editing requires authentication
        if (!user) {
          toast.error("You must be logged in to edit venues.");
          return;
        }
        
        console.log("Updating existing venue:", venueToEdit.id);
        const { data: updatedVenue, error } = await updateVenue(venueToEdit.id, formData);
        
        if (error) {
          console.error("Error updating venue:", error);
          throw error;
        }
        
        if (!updatedVenue) {
          throw new Error("No venue data returned from update");
        }
        
        savedVenue = updatedVenue;
        toast.success(`Venue "${savedVenue.name}" updated successfully!`);
      } else {
        // Creating can be done without authentication
        console.log("Creating new venue");
        const venueData = { 
          ...formData, 
          creator_id: user?.id || null // Can be null for non-authenticated users
        };
        const { data: newVenue, error } = await createVenue(venueData);
        
        if (error) {
          console.error("Error creating venue:", error);
          throw error;
        }
        
        if (!newVenue) {
          throw new Error("No venue data returned from creation");
        }
        
        savedVenue = newVenue;
        toast.success(`Venue "${savedVenue.name}" created successfully!`);
        
        // Show additional message for non-authenticated users
        if (!user) {
          toast.info("Your venue has been added to the public list. Sign up to manage your venues later!");
        }
      }
      
      // Invalidate and refetch venues
      await queryClient.invalidateQueries({ queryKey: ['venues'] });
      
      // Call the completion callback with the saved venue
      console.log("Calling onComplete with venue:", savedVenue);
      onComplete(savedVenue);
      
      // Close the modal
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Failed to save venue:", error);
      
      let errorMessage = "Failed to save venue. Please try again.";
      
      if (error?.code === '23505' && error?.message?.includes('venues_name_key')) {
        errorMessage = "A venue with this name already exists. Please use a different name.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
            {isEditMode 
              ? 'Update the details for this venue.' 
              : 'Add a new venue to the list. This will be available for all event creators.'
            }
            {!user && !isEditMode && (
              <span className="block mt-2 text-sm text-gray-600">
                No account needed - your venue will be added to the public list immediately.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <CreateVenueForm 
          onSubmit={handleFormSubmit} 
          isSubmitting={isSubmitting} 
          venue={venueToEdit} 
        />
      </DialogContent>
    </Dialog>
  );
};
