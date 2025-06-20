
import React from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { CategoryField } from './form-sections/CategoryField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { VenueField } from './form-sections/VenueField';
import { DetailsFields } from './form-sections/DetailsFields';
import { MetaFields } from './form-sections/MetaFields';
import { VibeField } from './form-sections/VibeField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Event } from '@/types';

interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
  initialData?: Event;
}

export const EventForm: React.FC<EventFormProps> = ({ eventId, isEditMode = false, initialData }) => {
  const {
    form,
    isSubmitting,
    venues,
    isLoadingVenues,
    isCreateVenueModalOpen,
    setCreateVenueModalOpen,
    handleVenueCreated,
    onSubmit,
    onInvalid,
  } = useEventForm({ eventId, isEditMode, initialData });

  const { register, handleSubmit, setValue, watch, formState: { errors }, control } = form;

  console.log('EventForm render - isEditMode:', isEditMode, 'eventId:', eventId, 'isSubmitting:', isSubmitting);
  console.log('Form errors:', errors);

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          {/* Required Fields Section */}
          <div className="space-y-8">
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
            <DetailsFields register={register} errors={errors} />
          </div>

          {/* Optional Fields Section */}
          <div className="border-t pt-8 mt-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Optional Details</h3>
              <p className="text-sm text-muted-foreground">
                These fields are optional but can help provide more information about your event.
              </p>
            </div>
            
            <div className="space-y-6">
              <VibeField control={control} />
              <MetaFields register={register} errors={errors} />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
            onClick={() => {
              console.log('Submit button clicked, isSubmitting:', isSubmitting);
              console.log('Current form values:', form.getValues());
            }}
          >
            {isSubmitting ? "Submitting..." : isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </form>
      </Form>
      <CreateVenueModal 
        open={isCreateVenueModalOpen}
        onOpenChange={setCreateVenueModalOpen}
        onComplete={handleVenueCreated}
      />
    </>
  );
};

export default EventForm;
