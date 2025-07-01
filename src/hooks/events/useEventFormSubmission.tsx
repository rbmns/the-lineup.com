
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { EventFormData } from '@/components/events/form/EventFormSchema';
import { useState, useCallback } from 'react';

export const useEventFormSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState('');

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      if (!user) {
        setShowAuthModal(true);
        throw new Error('User must be authenticated');
      }

      // Create start_datetime from date and time
      const startDatetime = new Date(`${data.startDate.toISOString().split('T')[0]}T${data.startTime}`);
      
      // Create end_datetime if end date and time are provided
      let endDatetime = null;
      if (data.endDate && data.endTime) {
        endDatetime = new Date(`${data.endDate.toISOString().split('T')[0]}T${data.endTime}`);
      } else if (data.endTime) {
        // Use start date with end time
        endDatetime = new Date(`${data.startDate.toISOString().split('T')[0]}T${data.endTime}`);
      }

      // Convert form data to database format
      const eventData = {
        title: data.title,
        description: data.description || null,
        venue_id: data.venueId || null,
        location: data.location || null,
        start_date: data.startDate.toISOString().split('T')[0],
        start_time: data.startTime,
        end_date: data.endDate?.toISOString().split('T')[0] || null,
        end_time: data.endTime || null,
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime?.toISOString() || null,
        fixed_start_time: !data.flexibleStartTime, // Invert the checkbox value
        timezone: data.timezone,
        event_category: data.eventCategory || null,
        vibe: data.vibe || null,
        fee: data.fee || null,
        organizer_link: data.organizerLink || null,
        tags: data.tags?.join(',') || null,
        creator: user.id,
        created_by: user.id,
        status: 'published' as const,
      };

      const { data: event, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      return event;
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setCreatedEventId(event.id);
      setCreatedEventTitle(event.title);
      setShowSuccessModal(true);
      toast({
        title: 'Event created successfully!',
        description: 'Your event has been published and is now visible to others.',
      });
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      if (!user) {
        setShowAuthModal(true);
      } else {
        toast({
          title: 'Error creating event',
          description: 'Please try again or contact support if the problem persists.',
          variant: 'destructive',
        });
      }
    },
  });

  const handleFormSubmit = useCallback((data: EventFormData) => {
    createEventMutation.mutate(data);
  }, [createEventMutation]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleAuthModalClose = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleEventCreated = useCallback((eventId: string, eventTitle: string) => {
    navigate(`/events/${eventId}`);
  }, [navigate]);

  return {
    createEvent: createEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    handleFormSubmit,
    handleAuthSuccess,
    handleAuthModalClose,
    handleEventCreated,
    showAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    createdEventId,
    createdEventTitle,
  };
};
