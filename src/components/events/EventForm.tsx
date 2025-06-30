
import React, { useState } from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { PrePublishAuthModal } from './PrePublishAuthModal';
import { EventPublishedModal } from './EventPublishedModal';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { VenueField } from './form-sections/VenueField';
import { CategoryToggleField } from './form-sections/CategoryToggleField';
import { VibeToggleField } from './form-sections/VibeToggleField';
import { OptionalFieldsSection } from './form-sections/OptionalFieldsSection';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
  initialData?: Event;
}

export const EventForm: React.FC<EventFormProps> = ({ eventId, isEditMode = false, initialData }) => {
  const { isAuthenticated, user, session } = useAuth();
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState<string>('');
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  
  const {
    form,
    isSubmitting,
    venues,
    isLoadingVenues,
    isCreateVenueModalOpen,
    setCreateVenueModalOpen,
    handleVenueCreated,
    onSubmit: originalOnSubmit,
    onInvalid,
  } = useEventForm({ 
    eventId, 
    isEditMode, 
    initialData,
    onEventCreated: (eventId: string, eventTitle: string) => {
      setCreatedEventId(eventId);
      setCreatedEventTitle(eventTitle);
      setShowSuccessModal(true);
    }
  });

  const { register, handleSubmit, setValue, watch, formState: { errors }, control } = form;

  const handleFormSubmit = async (data: any) => {
    console.log("Form submit called with data:", data);
    console.log("Is authenticated:", isAuthenticated);
    console.log("User object:", user);
    console.log("Session object:", session);
    console.log("Is edit mode:", isEditMode);
    
    // If editing an existing event, proceed normally
    if (isEditMode) {
      return originalOnSubmit(data);
    }

    // Check authentication using multiple indicators for reliability
    const isUserAuthenticated = isAuthenticated && user && session;
    
    // If not authenticated, store form data and show auth modal (without redundant toast)
    if (!isUserAuthenticated) {
      console.log("User not authenticated, showing auth modal");
      setPendingFormData(data);
      setShowAuthModal(true);
      return;
    }

    // If authenticated, proceed with submission
    console.log("User authenticated, proceeding with submission");
    return originalOnSubmit(data);
  };

  const handleAuthSuccess = async () => {
    console.log("Auth success callback called");
    console.log("Current auth state - isAuthenticated:", isAuthenticated, "user:", user);
    
    setShowAuthModal(false);
    
    if (pendingFormData) {
      console.log("Submitting pending form data after auth success");
      
      // Add a small delay to ensure auth state is fully propagated
      setTimeout(async () => {
        try {
          await originalOnSubmit(pendingFormData);
          setPendingFormData(null);
        } catch (error) {
          console.error("Error submitting form after auth:", error);
        }
      }, 500);
    }
  };

  const handleAuthModalClose = () => {
    console.log("Auth modal closed without success");
    setShowAuthModal(false);
    setPendingFormData(null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-8">
          {/* Required Fields Section */}
          <div className="space-y-6">
            <div className="pb-4 border-b border-mist-grey">
              <h3 className="text-h4 text-graphite-grey mb-2">Event Details</h3>
              <p className="text-small text-graphite-grey opacity-75">
                Tell people about your event
              </p>
            </div>
            
            <TitleField register={register} errors={errors} />
            <DescriptionField register={register} errors={errors} />
            <DateTimeFields register={register} watch={watch} setValue={setValue} errors={errors} />
            <VenueField 
              watch={watch} 
              setValue={setValue} 
              errors={errors} 
              venues={venues} 
              isLoadingVenues={isLoadingVenues} 
              onOpenCreateVenueModal={() => setCreateVenueModalOpen(true)}
            />
            <CategoryToggleField watch={watch} setValue={setValue} errors={errors} />
            <VibeToggleField watch={watch} setValue={setValue} errors={errors} />
          </div>

          {/* Optional Fields Section */}
          <div className="pt-6 border-t border-mist-grey">
            <div className="pb-4">
              <h3 className="text-h4 text-graphite-grey mb-2">Additional Information</h3>
              <p className="text-small text-graphite-grey opacity-75">
                Optional details to help attendees
              </p>
            </div>
            
            <OptionalFieldsSection 
              register={register} 
              errors={errors} 
              control={control}
              watch={watch}
              setValue={setValue}
            />
          </div>

          {/* Submit Button */}
          <div className={cn(
            "pt-8 border-t border-mist-grey",
            isMobile ? "pb-4" : "pb-0"
          )}>
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting}
              className={cn(
                "btn-primary text-base font-semibold py-4 px-8 min-h-[50px]",
                isMobile ? "w-full" : "w-auto"
              )}
            >
              {isSubmitting ? "Publishing..." : isEditMode ? "Update Event" : "Publish Event"}
            </Button>
          </div>
        </form>
      </Form>

      <CreateVenueModal 
        open={isCreateVenueModalOpen}
        onOpenChange={setCreateVenueModalOpen}
        onComplete={handleVenueCreated}
      />

      <PrePublishAuthModal
        open={showAuthModal}
        onClose={handleAuthModalClose}
        onSuccess={handleAuthSuccess}
      />

      <EventPublishedModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        eventId={createdEventId || undefined}
        eventTitle={createdEventTitle}
      />
    </>
  );
};

export default EventForm;
