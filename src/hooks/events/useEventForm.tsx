import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

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
  initialData?: Event;
}

// Helper function to ensure URL has protocol
const ensureHttpProtocol = (url: string): string => {
  if (!url) return url;
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return trimmedUrl;
  
  // If URL already has a protocol, return as is
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }
  
  // Add http:// if missing
  return `http://${trimmedUrl}`;
};

export const useEventForm = ({ eventId, isEditMode = false, initialData }: UseEventFormProps) => {
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
      vibe: null,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      console.log('Populating form with initial data:', initialData);
      const fetchedEventData = initialData;
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
          vibe: (fetchedEventData as any).vibe || null,
      };
      
      console.log('Setting form values:', defaultVals);
      Object.entries(defaultVals).forEach(([key, value]) => {
          form.setValue(key as keyof FormValues, value as any);
      });
      
      // Force form to recognize it has been modified with initial data
      form.trigger();
    }
  }, [isEditMode, initialData, form]);
  
  const handleVenueCreated = (newVenue: Venue) => {
    queryClient.invalidateQueries({ queryKey: ['venues'] });
    form.setValue("venue_id", newVenue.id, { shouldValidate: true, shouldDirty: true });
    setCreateVenueModalOpen(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log('Form submission started with data:', data);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process URLs to ensure they have proper protocol
      const processedData = {
        ...data,
        organizer_link: data.organizer_link ? ensureHttpProtocol(data.organizer_link) : '',
        booking_link: data.booking_link ? ensureHttpProtocol(data.booking_link) : '',
        extra_info: data.extra_info || '', // Ensure extra_info is always a string
      };

      const processedEventData = processFormData(processedData, user.id);
      console.log('Processed event data for submission:', JSON.stringify(processedEventData, null, 2));
      
      if (isEditMode && eventId) {
        console.log('Updating event with ID:', eventId);
        const { error } = await updateEvent(eventId, processedEventData as any);
        if (error) {
          console.error("Failed to update event", error);
          console.error("Supabase error details:", JSON.stringify(error, null, 2));
          
          let errorMessage = "Failed to update event";
          if (error.message?.includes('duplicate key')) {
            errorMessage = "An event with this title already exists. Please choose a different title.";
          } else if (error.message?.includes('invalid input')) {
            errorMessage = "Please check your input data and try again.";
          } else if (error.message?.includes('extra_info')) {
            errorMessage = "There was an issue with the additional information field. Please try again.";
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          toast({
            title: "Update Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
        console.log("Event updated successfully");
        toast({
          title: 'Event Updated! 🎉',
          description: 'Your event changes have been saved successfully.',
        });
        
        // Force refetch of events data
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
        await queryClient.refetchQueries({ queryKey: ['events'] });
        
        navigate('/events');
      } else {
        console.log('Creating new event');
        const { data: createdEvent, error } = await createEvent(processedEventData as any);
        if (error) {
          console.error("Failed to create event", error);
          console.error("Supabase error details:", JSON.stringify(error, null, 2));
          
          let errorMessage = "Failed to create event";
          if (error.message?.includes('duplicate key')) {
            errorMessage = "An event with this title already exists. Please choose a different title.";
          } else if (error.message?.includes('invalid input')) {
            errorMessage = "Please check your input data and try again.";
          } else if (error.message?.includes('venue_id')) {
            errorMessage = "Please select a valid venue for your event.";
          } else if (error.message?.includes('extra_info')) {
            errorMessage = "There was an issue with the additional information field. Please try again.";
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          toast({
            title: "Creation Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
        console.log("Event created successfully in DB:", createdEvent);
        toast({
          title: 'Event Created! 🎉',
          description: 'Your new event is now live and ready for RSVPs.',
        });
        
        // Force refetch of events data and navigate to events page
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.refetchQueries({ queryKey: ['events'] });
        
        // Navigate to events page instead of organise dashboard
        setTimeout(() => {
          navigate('/events');
        }, 500);
      }
    } catch (error: any) {
      console.error("Form submission error", error);
      
      let errorMessage = "Failed to save event. Please try again.";
      if (error?.message?.includes('Network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error?.message?.includes('extra_info')) {
        errorMessage = "There was an issue with the additional information field. Please try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    console.log('Form validation errors:', errors);
    const errorFields = Object.keys(errors);
    const firstError = errors[errorFields[0] as keyof FormValues];
    
    toast({
      title: "Form Validation Error",
      description: firstError?.message || "Please correct the errors in the form",
      variant: "destructive",
    });

    // Scroll to first error field
    const firstErrorField = document.querySelector(`[name="${errorFields[0]}"]`) as HTMLElement;
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }
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
