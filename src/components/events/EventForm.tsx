
import React from 'react';
import { useEventForm } from '@/hooks/events/useEventForm.tsx';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { TitleField } from './form-sections/TitleField';
import { DescriptionField } from './form-sections/DescriptionField';
import { CategoryField } from './form-sections/CategoryField';
import { DateTimeFields } from './form-sections/DateTimeFields';
import { VenueField } from './form-sections/VenueField';
import { RequiredDetailsFields } from './form-sections/RequiredDetailsFields';
import { OptionalDetailsFields } from './form-sections/OptionalDetailsFields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          {/* Required Fields Section */}
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

          {/* Optional Fields Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="optional-details" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-medium hover:no-underline py-4">
                Optional Additional Info
                <span className="text-sm text-muted-foreground ml-2 font-normal">
                  (Expand to add more details)
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-6 pt-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    These fields are optional but can help provide more information about your event.
                  </p>
                  <OptionalDetailsFields register={register} control={control} errors={errors} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              onClick={() => {
                console.log('Submit button clicked, isSubmitting:', isSubmitting);
                console.log('Current form values:', form.getValues());
              }}
            >
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Event" : "Create Event"}
            </Button>
          </div>
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
