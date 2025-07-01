
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
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      if (!currentUser) {
        console.error('No authenticated user found');
        setShowAuthModal(true);
        throw new Error('User must be authenticated');
      }

      console.log('Creating event with user:', currentUser.id);

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
        creator: currentUser.id,
        created_by: currentUser.id,
        status: 'published' as const,
      };

      console.log('Event data being sent:', eventData);

      const { data: event, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Event created successfully:', event);
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
      
      // Check if it's an auth error
      if (error.message.includes('User must be authenticated') || error.message.includes('JWT')) {
        setShowAuthModal(true);
        toast({
          title: 'Authentication required',
          description: 'Please sign in to create an event.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error creating event',
          description: error.message || 'Please try again or contact support if the problem persists.',
          variant: 'destructive',
        });
      }
    },
  });

  const handleFormSubmit = useCallback((data: EventFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Current user:', user);
    
    // Double-check authentication before submitting
    if (!user) {
      console.error('No user in context');
      setShowAuthModal(true);
      return;
    }
    
    createEventMutation.mutate(data);
  }, [createEventMutation, user]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    // Optionally retry the form submission after auth success
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
