
import React from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { useEventFormSubmission } from '@/hooks/events/useEventFormSubmission.tsx';
import { EventFormModals } from './EventFormModals';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { LocationFields } from './form-sections/LocationFields';
import { BookingInfoSection } from './form-sections/BookingInfoSection';
import { DiscoverabilitySection } from './form-sections/DiscoverabilitySection';
import { ImageUploadField } from './form-sections/ImageUploadField';
import { EventFormActions } from './form-sections/EventFormActions';
import { Form } from '@/components/ui/form';
import { Event } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Mail } from 'lucide-react';

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
  } = useEventForm(initialData ? {
    title: initialData.title || '',
    description: initialData.description || '',
    venueName: (initialData as any).venue_name || '',
    address: (initialData as any).address || '',
    city: initialData.destination || '',
    postalCode: (initialData as any).postal_code || '',
    startDate: initialData.start_datetime ? new Date(initialData.start_datetime) : undefined,
    startTime: initialData.start_datetime ? new Date(initialData.start_datetime).toTimeString().slice(0,5) : '',
    endDate: initialData.end_datetime ? new Date(initialData.end_datetime) : undefined,
    endTime: initialData.end_datetime ? new Date(initialData.end_datetime).toTimeString().slice(0,5) : '',
    timezone: initialData.timezone || 'Europe/Amsterdam',
    eventCategory: initialData.event_category || '',
    vibe: initialData.vibe || '',
    fee: String(initialData.fee || ''),
    bookingLink: initialData.booking_link || '',
    googleMaps: initialData.google_maps || '',
    tags: initialData.tags ? (typeof initialData.tags === 'string' ? initialData.tags.split(', ').filter(tag => tag.trim()) : initialData.tags) : [],
  } : undefined);

  const {
    handleFormSubmit,
    handleAuthSuccess,
    handleAuthModalClose,
    handleEventCreated,
    showAuthModal,
    showSuccessModal,
    showPendingModal,
    setShowSuccessModal,
    setShowPendingModal,
    createdEventId,
    createdEventTitle,
    isCreating
  } = useEventFormSubmission(eventId, isEditMode);
  
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = form;

  // Check if there are any form errors
  const hasFormErrors = Object.keys(errors).length > 0;

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto",
      isMobile ? "px-2 py-4" : "px-6 py-8"
    )}>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
          {/* Form Validation Alert */}
          {hasFormErrors && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="mb-2">Please fix the following errors before submitting:</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                      {error?.message}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-gray-600 flex items-center gap-1 mt-3">
                  <Mail className="h-3 w-3" />
                  Need help? Contact us at{' '}
                  <a 
                    href="mailto:events@the-lineup.com" 
                    className="text-ocean-teal hover:underline font-medium"
                  >
                    events@the-lineup.com
                  </a>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information Section */}
          <div className={cn(
            "bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20",
            isMobile ? "p-3" : "p-6"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
              <h2 className={cn(
                "font-semibold text-ocean-teal",
                isMobile ? "text-base" : "text-xl"
              )}>Event Details</h2>
            </div>
            <div className="space-y-3">
              <TitleField />
              <DescriptionField />
              <ImageUploadField />
            </div>
          </div>

          {/* Date & Time Section */}
          <DateTimeFields form={form} />

          {/* Location Section */}
          <div className={cn(
            "bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20",
            isMobile ? "p-3" : "p-6"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
              <h2 className={cn(
                "font-semibold text-ocean-teal",
                isMobile ? "text-base" : "text-xl"
              )}>Location</h2>
            </div>
            <LocationFields />
          </div>

          {/* Discoverability Section */}
          <DiscoverabilitySection />

          {/* Booking Info Section */}
          <BookingInfoSection />

          {/* Submit Button */}
          <div className={cn(
            "sticky bottom-0 bg-white/95 backdrop-blur-sm border-t pt-3 -mx-2 px-2",
            isMobile ? "pb-4" : "pb-4"
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
