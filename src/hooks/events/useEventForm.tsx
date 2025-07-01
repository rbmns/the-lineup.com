
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormData } from '@/components/events/form/EventFormSchema';
import { useVenues } from '@/hooks/useVenues';
import { useEventVibes } from '@/hooks/useEventVibes';

export const useEventForm = (defaultValues?: Partial<EventFormData>) => {
  const { venues } = useVenues();
  const { vibes } = useEventVibes();

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

  return {
    form,
    venues: venues || [],
    vibes: vibes || [],
  };
};
