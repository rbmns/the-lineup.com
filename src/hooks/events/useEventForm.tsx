
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormData } from '@/components/events/form/EventFormSchema';
import { useEventVibes } from '@/hooks/useEventVibes';
import { useCallback } from 'react';

export const useEventForm = (defaultValues?: Partial<EventFormData>) => {
  const { vibes } = useEventVibes();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      venueName: '',
      address: '',
      city: '',
      postalCode: '',
      startTime: '',
      endTime: '',
      flexibleStartTime: false,
      timezone: 'Europe/Amsterdam',
      eventCategory: '',
      vibe: '',
      fee: '',
      bookingLink: '',
      googleMaps: '',
      tags: [],
      ...defaultValues,
    },
  });

  const onSubmit = useCallback((data: EventFormData) => {
    console.log('✅ useEventForm onSubmit called with data:', data);
  }, []);

  const onInvalid = useCallback((errors: any) => {
    console.error('❌ Form validation errors in useEventForm:', errors);
    console.error('❌ Detailed validation errors:', Object.entries(errors).map(([field, error]: [string, any]) => ({
      field,
      message: error?.message || 'Unknown error',
      type: error?.type || 'unknown'
    })));
  }, []);

  return {
    form,
    vibes: vibes || [],
    isSubmitting: false,
    onSubmit,
    onInvalid,
  };
};
