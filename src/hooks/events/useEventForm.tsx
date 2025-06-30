import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { EventSchema } from '@/components/events/form/EventFormSchema';
import { Event, Venue } from '@/types';
import { useVenues } from '@/hooks/useVenues';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createSlug } from '@/utils/supabaseHelpers';
import TimezoneService from '@/services/timezoneService';

interface UseEventFormProps {
  eventId?: string;
  isEditMode?: boolean;
  initialData?: Event;
}

export const useEventForm = ({
  eventId,
  isEditMode = false,
  initialData
}: UseEventFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { venues, isLoading: isLoadingVenues } = useVenues();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateVenueModalOpen, setCreateVenueModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      start_time: initialData?.start_time || '',
      end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
      end_time: initialData?.end_time || '',
      venue_id: initialData?.venue_id || '',
      event_category: initialData?.event_category || '',
      vibe: initialData?.vibe || '',
      timezone: initialData?.timezone || 'Europe/Amsterdam',
      organizer_link: initialData?.organizer_link || '',
      fee: typeof initialData?.fee === 'number' ? initialData.fee.toString() : (initialData?.fee || ''),
      booking_link: initialData?.booking_link || '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
      extra_info: initialData?.extra_info || ''
    }
  });

  // Watch venue selection to auto-detect timezone (silently)
  const selectedVenueId = form.watch('venue_id');

  useEffect(() => {
    const autoDetectTimezone = async () => {
      if (!selectedVenueId || !venues) return;

      const selectedVenue = venues.find(v => v.id === selectedVenueId);
      if (!selectedVenue?.city) return;

      try {
        const detectedTimezone = await TimezoneService.getTimezoneForCity(selectedVenue.city);
        
        // Automatically set the timezone without showing it to the user
        form.setValue('timezone', detectedTimezone);
      } catch (error) {
        console.error('Error auto-detecting timezone:', error);
        // Keep default timezone if detection fails
        form.setValue('timezone', 'Europe/Amsterdam');
      }
    };

    autoDetectTimezone();
  }, [selectedVenueId, venues, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to create events');
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = createSlug(data.title, data.start_date.toISOString().split('T')[0]);
      
      const eventData = {
        ...data,
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: data.end_date.toISOString().split('T')[0],
        creator: user.id,
        created_by: user.id,
        slug,
        status: 'published' as const
      };

      let result;
      if (isEditMode && eventId) {
        result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      const action = isEditMode ? 'updated' : 'created';
      toast.success(`Event ${action} successfully!`);

      if (isEditMode) {
        navigate(`/events/${result.data.slug || result.data.id}`);
      }

    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log('Form validation errors:', errors);
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  const handleVenueCreated = (venue: Venue) => {
    form.setValue('venue_id', venue.id);
    toast.success(`Venue "${venue.name}" selected!`);
  };

  return {
    form,
    isSubmitting,
    venues: venues || [],
    isLoadingVenues,
    isCreateVenueModalOpen,
    setCreateVenueModalOpen,
    handleVenueCreated,
    onSubmit,
    onInvalid
  };
};
