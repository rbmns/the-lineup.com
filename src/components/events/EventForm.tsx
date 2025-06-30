import React, { useState } from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { PrePublishAuthModal } from './PrePublishAuthModal';
import { EventPublishedModal } from './EventPublishedModal';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { VenueField } from './form-sections/VenueField';
import { TimezoneField } from './form-sections/TimezoneField';
import { CategoryToggleField } from './form-sections/CategoryToggleField';
import { VibeToggleField } from './form-sections/VibeToggleField';
import { OptionalFieldsSection } from './form-sections/OptionalFieldsSection';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
  initialData?: Event;
}

export const EventForm: React.FC<EventFormProps> = ({
  eventId,
  isEditMode = false,
  initialData
}) => {
  const {
    isAuthenticated,
    user,
    session
  } = useAuth();
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
    autoDetectedTimezone,
    selectedVenueName
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
  
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control
  } = form;

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

    // If not authenticated, store form data and show auth modal
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
    setShowAuthModal(false);
    
    if (pendingFormData) {
      console.log("Submitting pending form data after auth success");
      
      // Show a toast to let user know we're processing their event
      toast({
        title: "Publishing your event...",
        description: "Please wait while we publish your event.",
      });

      // Add a delay to ensure auth state is fully propagated for new accounts
      setTimeout(async () => {
        // Check auth state before proceeding - for new accounts, they should be logged in now
        if (isAuthenticated && user && session) {
          try {
            console.log("Auth confirmed, now submitting event");
            await originalOnSubmit(pendingFormData);
            setPendingFormData(null);
          } catch (error) {
            console.error("Error submitting form after auth:", error);
            toast({
              title: "Event publishing failed",
              description: "Please try again or check your connection.",
              variant: "destructive"
            });
          }
        } else {
          console.log("Auth state not yet confirmed, retrying in a moment");
          // For new accounts, auth state might take longer to propagate
          setTimeout(async () => {
            if (isAuthenticated && user && session) {
              try {
                console.log("Auth confirmed on retry, now submitting event");
                await originalOnSubmit(pendingFormData);
                setPendingFormData(null);
              } catch (error) {
                console.error("Error submitting form after auth retry:", error);
                toast({
                  title: "Event publishing failed",
                  description: "Please try refreshing the page and try again.",
                  variant: "destructive"
                });
              }
            } else {
              console.log("Auth state still not confirmed, asking user to try again");
              toast({
                title: "Please try again",
                description: "Your account was created but there was an issue publishing your event. Please try again.",
                variant: "destructive"
              });
              setPendingFormData(null);
            }
          }, 2000);
        }
      }, 1000);
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
        <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className={cn(
          "space-y-6",
          isMobile ? "px-2" : "space-y-8"
        )}>
          {/* Required Fields Section */}
          <div className="space-y-6">
            <TitleField errors={errors} />
            <DescriptionField errors={errors} />
            <DateTimeFields watch={watch} setValue={setValue} errors={errors} />
            <VenueField 
              watch={watch} 
              setValue={setValue} 
              errors={errors} 
              venues={venues} 
              isLoadingVenues={isLoadingVenues} 
              onOpenCreateVenueModal={() => setCreateVenueModalOpen(true)} 
            />
            <TimezoneField 
              autoDetectedTimezone={autoDetectedTimezone || undefined}
              venueName={selectedVenueName}
            />
            <CategoryToggleField watch={watch} setValue={setValue} errors={errors} />
            <VibeToggleField watch={watch} setValue={setValue} errors={errors} />
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-6">
            <OptionalFieldsSection 
              errors={errors} 
              control={control} 
              watch={watch} 
              setValue={setValue} 
            />
          </div>

          {/* Submit Button */}
          <div className={cn(
            "pt-6 border-t border-mist-grey sticky bottom-0 bg-white",
            isMobile ? "pb-6 -mx-2 px-4" : "pb-4"
          )}>
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting} 
              className="w-full h-12 text-base font-semibold bg-ocean-teal hover:bg-ocean-teal/90"
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
