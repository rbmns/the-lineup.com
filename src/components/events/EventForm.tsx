
import React, { useState } from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { PrePublishAuthModal } from './PrePublishAuthModal';
import { EventPublishedModal } from './EventPublishedModal';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { CategoryField } from './form-sections/CategoryField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { VenueField } from './form-sections/VenueField';
import { OptionalFieldsSection } from './form-sections/OptionalFieldsSection';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';

interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
  initialData?: Event;
}

export const EventForm: React.FC<EventFormProps> = ({ eventId, isEditMode = false, initialData }) => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState<string>('');
  
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
    // If editing an existing event, proceed normally
    if (isEditMode) {
      return originalOnSubmit(data);
    }

    // If not authenticated, show the auth modal first
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // If authenticated, proceed with submission
    return originalOnSubmit(data);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Trigger form submission after successful authentication
    setTimeout(() => {
      handleSubmit(originalOnSubmit, onInvalid)();
    }, 100);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-6">
          {/* Required Fields */}
          <div className="space-y-6">
            <TitleField register={register} errors={errors} />
            <DescriptionField register={register} errors={errors} />
            <CategoryField watch={watch} setValue={setValue} errors={errors} />
            <DateTimeFields register={register} watch={watch} setValue={setValue} errors={errors} />
            <VenueField 
              watch={watch} 
              setValue={setValue} 
              errors={errors} 
              venues={venues} 
              isLoadingVenues={isLoadingVenues} 
              onOpenCreateVenueModal={() => setCreateVenueModalOpen(true)}
            />
          </div>

          {/* Optional Fields */}
          <div className="pt-4">
            <OptionalFieldsSection 
              register={register} 
              errors={errors} 
              control={control}
              watch={watch}
              setValue={setValue}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
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
        onClose={() => setShowAuthModal(false)}
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
