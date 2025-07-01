
import React from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { useEventFormSubmission } from '@/hooks/events/useEventFormSubmission.tsx';
import { EventFormModals } from './EventFormModals';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { LocationFields } from './form-sections/LocationFields';
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
    vibes,
    isSubmitting,
    onSubmit,
    onInvalid
  } = useEventForm();

  const {
    handleFormSubmit,
    handleAuthSuccess,
    handleAuthModalClose,
    handleEventCreated,
    showAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    createdEventId,
    createdEventTitle,
    isCreating
  } = useEventFormSubmission();
  
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = form;

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto",
      isMobile ? "px-4 py-6" : "px-6 py-8"
    )}>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-6">
          {/* Basic Information Section */}
          <div className={cn(
            "bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20",
            isMobile ? "p-4" : "p-6"
          )}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-ocean-teal rounded-full"></div>
              <h2 className={cn(
                "font-semibold text-ocean-teal",
                isMobile ? "text-lg" : "text-xl"
              )}>Basic Information</h2>
            </div>
            <div className="space-y-4">
              <TitleField />
              <DescriptionField />
            </div>
          </div>

          {/* Date & Time Section */}
          <DateTimeFields form={form} />

          {/* Location & Details Section */}
          <div className={cn(
            "bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20",
            isMobile ? "p-4" : "p-6"
          )}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-ocean-teal rounded-full"></div>
              <h2 className={cn(
                "font-semibold text-ocean-teal",
                isMobile ? "text-lg" : "text-xl"
              )}>Location & Details</h2>
            </div>
            <div className="space-y-4">
              <LocationFields />
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-2"
              )}>
                <CategoryToggleField />
                <VibeToggleField />
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <OptionalFieldsSection 
            control={control} 
          />

          {/* Submit Button */}
          <div className={cn(
            "sticky bottom-0 bg-white/95 backdrop-blur-sm border-t pt-4 -mx-4 px-4",
            isMobile ? "pb-safe" : "pb-4"
          )}>
            <EventFormActions 
              isSubmitting={isCreating} 
              isEditMode={isEditMode} 
            />
          </div>
        </form>
      </Form>

      <EventFormModals
        showAuthModal={showAuthModal}
        onAuthModalClose={handleAuthModalClose}
        onAuthSuccess={handleAuthSuccess}
        showSuccessModal={showSuccessModal}
        onSuccessModalClose={() => setShowSuccessModal(false)}
        createdEventId={createdEventId || undefined}
        createdEventTitle={createdEventTitle}
      />
    </div>
  );
};

export default EventForm;
