
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Event, Venue } from '@/types';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { EventSchema } from '@/components/events/form/EventFormSchema';
import { processFormData } from '@/components/events/form/EventFormUtils';
import { fetchEventById, createEvent, updateEvent } from '@/lib/eventService';
import { useAuth } from '@/contexts/AuthContext';
import { useVenues } from '@/hooks/useVenues';

interface UseEventFormProps {
  eventId?: string;
  isEditMode?: boolean;
}

export const useEventForm = ({ eventId, isEditMode = false }: UseEventFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { venues, isLoading: isLoadingVenues } = useVenues();
  const [isCreateVenueModalOpen, setCreateVenueModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: '',
      description: '',
      event_category: 'other',
      start_date: new Date(),
      start_time: '',
      end_date: new Date(),
      end_time: '',
      venue_id: '',
      organizer_link: '',
      fee: '0',
      booking_link: '',
      extra_info: '',
      tags: '',
      vibe: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchEventData = async () => {
      if (isEditMode && eventId && user?.id) {
        try {
          const fetchedEventData = await fetchEventById(eventId, user.id);
          if (fetchedEventData) {
            const defaultVals = {
                title: fetchedEventData.title || '',
                description: fetchedEventData.description || '',
                event_category: (fetchedEventData as any).event_category || (fetchedEventData as any).event_type || 'other',
                start_date: fetchedEventData.start_date ? new Date(fetchedEventData.start_date) : new Date(),
                start_time: fetchedEventData.start_time?.substring(0, 5) || '',
                end_date: fetchedEventData.end_date ? new Date(fetchedEventData.end_date) : new Date(),
                end_time: fetchedEventData.end_time?.substring(0, 5) || '',
                venue_id: fetchedEventData.venue_id || '',
                organizer_link: fetchedEventData.organizer_link || '',
                fee: fetchedEventData.fee?.toString() || '0',
                booking_link: fetchedEventData.booking_link || '',
                extra_info: fetchedEventData.extra_info || '',
                tags: Array.isArray(fetchedEventData.tags) ? fetchedEventData.tags.join(', ') : (fetchedEventData.tags || ''),
                vibe: (fetchedEventData as any).vibe || '',
            };
            Object.entries(defaultVals).forEach(([key, value]) => {
                form.setValue(key as keyof FormValues, value);
            });
          }
        } catch (error) {
          console.error("Failed to fetch event data for editing", error);
          toast.error("Failed to fetch event data for editing");
        }
      }
    };

    fetchEventData();
  }, [isEditMode, eventId, user?.id, form.setValue]);
  
  const handleVenueCreated = (newVenue: Venue) => {
    queryClient.invalidateQueries({ queryKey: ['venues'] });
    form.setValue("venue_id", newVenue.id, { shouldValidate: true, shouldDirty: true });
    setCreateVenueModalOpen(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
      toast.error("You must be logged in to create an event.");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const processedEventData = processFormData(data, user.id);
      console.log('Submitting event data:', JSON.stringify(processedEventData, null, 2));
      
      if (isEditMode && eventId) {
        const { error } = await updateEvent(eventId, processedEventData as any);
        if (error) {
          console.error("Failed to update event", error);
          console.error("Supabase error details:", JSON.stringify(error, null, 2));
          throw error;
        }
        toast.success('Event updated successfully!');
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
        navigate('/events');
      } else {
        const { data: createdEvent, error } = await createEvent(processedEventData as any);
        if (error) {
          console.error("Failed to create event", error);
          console.error("Supabase error details:", JSON.stringify(error, null, 2));
          throw error;
        }
        console.log("Event created successfully in DB:", createdEvent);
        toast.success('Event created successfully!');
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        navigate('/events');
      }
    } catch (error: any) {
      console.error("Form submission error", error);
      toast.error(error.message || "Failed to save event. Please check the form data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorList = Object.entries(errors).map(([fieldName, error]) => {
      const formattedFieldName = fieldName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return (
        <div key={fieldName}>
          <strong>{formattedFieldName}:</strong> {error.message}
        </div>
      );
    });

    toast.error("Please correct the errors in the form", {
      description: <div className="flex flex-col gap-1 mt-2">{errorList}</div>,
    });
  };

  return {
    form,
    isSubmitting,
    isEditMode,
    venues,
    isLoadingVenues,
    isCreateVenueModalOpen,
    setCreateVenueModalOpen,
    handleVenueCreated,
    onSubmit,
    onInvalid,
  };
};
