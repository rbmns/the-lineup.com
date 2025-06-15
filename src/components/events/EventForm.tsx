
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

interface EventFormProps {
  eventId?: string;
  isEditMode?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ eventId, isEditMode = false }) => {
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
  } = useEventForm({ eventId, isEditMode });

  const { register, handleSubmit, setValue, watch, formState: { errors }, control } = form;

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
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
          <MetaFields register={register} errors={errors} />
          <VibeField control={control} />

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </form>
      </Form>
      <CreateVenueModal 
        open={isCreateVenueModalOpen}
        onOpenChange={setCreateVenueModalOpen}
        onVenueCreated={handleVenueCreated}
      />
    </>
  );
};

export default EventForm;
