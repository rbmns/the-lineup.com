
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateVenueForm } from './CreateVenueForm';
import { createVenue, updateVenue } from '@/lib/venueService';
import { CreateVenueFormValues } from './CreateVenueSchema';
import { toast } from 'sonner';
import { Venue } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();

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
          toast.error("Failed to update venue. Please try again.");
          return;
        }
        
        if (!updatedVenue) {
          toast.error("No venue data returned from update");
          return;
        }
        
        savedVenue = updatedVenue;
        toast.success(`Venue "${savedVenue.name}" updated successfully!`);
      } else {
        // Creating can be done without authentication
        console.log("Creating new venue", user ? "as authenticated user" : "as unauthenticated user");
        const { data: newVenue, error } = await createVenue(formData);
        
        if (error) {
          console.error("Error creating venue:", error);
          
          // More specific error handling
          let errorMessage = "Failed to create venue. Please try again.";
          
          if (error?.code === '23505') {
            if (error?.message?.includes('venues_name_key')) {
              errorMessage = "A venue with this name already exists. Please use a different name.";
            } else {
              errorMessage = "This venue already exists. Please check if it's already in the list.";
            }
          } else if (error?.code === '42501') {
            errorMessage = "Permission denied. Please try again or contact support.";
          } else if (error?.message?.includes('violates row-level security')) {
            errorMessage = "There was a security issue creating the venue. Please try again.";
          } else if (error?.message) {
            errorMessage = `Error: ${error.message}`;
          }
          
          toast.error(errorMessage);
          return;
        }
        
        if (!newVenue) {
          toast.error("No venue data returned. Please try again.");
          return;
        }
        
        savedVenue = newVenue;
        toast.success(`Venue "${savedVenue.name}" created successfully!`);
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
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto",
        isMobile ? "p-4 mx-2 my-4 top-4 translate-y-0" : "p-8"
      )}>
        <DialogHeader className="space-y-4 mb-6">
          <DialogTitle className="form-section-title">
            {isEditMode ? 'Edit Venue' : 'Create a New Venue'}
          </DialogTitle>
          <DialogDescription className="form-section-description text-base">
            {isEditMode 
              ? 'Update the details for this venue.' 
              : 'Add a new venue to the list. This will be available for all event creators.'
            }
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
