import React from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { useEventFormSubmission } from '@/hooks/events/useEventFormSubmission.tsx';
import { EventFormModals } from './EventFormModals';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { VenueField } from './form-sections/VenueField';
import { CategoryToggleField } from './form-sections/CategoryToggleField';
import { VibeToggleField } from './form-sections/VibeToggleField';
import { OptionalFieldsSection } from './form-sections/OptionalFieldsSection';
import { EventFormActions } from './form-sections/EventFormActions';
import { Form } from '@/components/ui/form';
import { Event } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  
  const {
    form,
    isSubmitting,
    venues,
    isLoadingVenues,
    isCreateVenueModalOpen,
    setCreateVenueModalOpen,
    handleVenueCreated,
    onSubmit: originalOnSubmit,
    onInvalid
  } = useEventForm({
    eventId,
    isEditMode,
    initialData
  });

  // Define handleEventCreated first
  const handleEventCreated = (eventId: string, eventTitle: string) => {
    // This will be handled by useEventFormSubmission
  };

  const {
    handleFormSubmit,
    handleAuthSuccess,
    handleAuthModalClose,
    handleEventCreated: handleEventCreatedFromSubmission,
    showAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    createdEventId,
    createdEventTitle
  } = useEventFormSubmission({
    isEditMode,
    originalOnSubmit,
    onEventCreated: handleEventCreated
  });
  
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = form;

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className={cn(
          "space-y-8",
          isMobile ? "px-2" : ""
        )}>
          {/* Basic Information Section */}
          <div className="bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 p-6 rounded-lg border border-ocean-teal/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-ocean-teal rounded-full"></div>
              <h2 className="text-xl font-semibold text-ocean-teal">Basic Information</h2>
            </div>
            <div className="space-y-6">
              <TitleField errors={errors} />
              <DescriptionField errors={errors} />
            </div>
          </div>

          {/* Date & Time Section */}
          <DateTimeFields watch={watch} setValue={setValue} errors={errors} />

          {/* Location & Details Section */}
          <div className="bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 p-6 rounded-lg border border-ocean-teal/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-ocean-teal rounded-full"></div>
              <h2 className="text-xl font-semibold text-ocean-teal">Location & Details</h2>
            </div>
            <div className="space-y-6">
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
          </div>

          {/* Optional Fields Section */}
          <OptionalFieldsSection 
            errors={errors} 
            control={form.control} 
            watch={watch} 
            setValue={setValue} 
          />

          {/* Submit Button */}
          <EventFormActions 
            isSubmitting={isSubmitting} 
            isEditMode={isEditMode} 
          />
        </form>
      </Form>

      <EventFormModals
        isCreateVenueModalOpen={isCreateVenueModalOpen}
        setCreateVenueModalOpen={setCreateVenueModalOpen}
        onVenueCreated={handleVenueCreated}
        showAuthModal={showAuthModal}
        onAuthModalClose={handleAuthModalClose}
        onAuthSuccess={handleAuthSuccess}
        showSuccessModal={showSuccessModal}
        onSuccessModalClose={() => setShowSuccessModal(false)}
        createdEventId={createdEventId || undefined}
        createdEventTitle={createdEventTitle}
      />
    </>
  );
};

export default EventForm;
