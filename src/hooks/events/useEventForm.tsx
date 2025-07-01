
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormData } from '@/components/events/form/EventFormSchema';
import { useVenues } from '@/hooks/useVenues';
import { useEventVibes } from '@/hooks/useEventVibes';
import { useState, useCallback } from 'react';
import { Venue } from '@/types';

export const useEventForm = (defaultValues?: Partial<EventFormData>) => {
  const { venues, isLoading: isLoadingVenues } = useVenues();
  const { vibes } = useEventVibes();
  const [isCreateVenueModalOpen, setCreateVenueModalOpen] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      venueId: '',
      location: '',
      startTime: '',
      endTime: '',
      flexibleStartTime: false,
      timezone: 'Europe/Amsterdam',
      eventCategory: '',
      vibe: '',
      fee: '',
      organizerLink: '',
      tags: [],
      ...defaultValues,
    },
  });

  const handleVenueCreated = useCallback((venue: Venue) => {
    form.setValue('venueId', venue.id);
    setCreateVenueModalOpen(false);
  }, [form]);

  const onSubmit = useCallback((data: EventFormData) => {
    console.log('Form submitted:', data);
  }, []);

  const onInvalid = useCallback((errors: any) => {
    console.log('Form validation errors:', errors);
  }, []);

  return {
    form,
    venues: venues || [],
    vibes: vibes || [],
    isSubmitting: false,
    isLoadingVenues,
    isCreateVenueModalOpen,
    setCreateVenueModalOpen,
    handleVenueCreated,
    onSubmit,
    onInvalid,
  };
};
