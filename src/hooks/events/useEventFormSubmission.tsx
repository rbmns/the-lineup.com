
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { EventFormData } from '@/components/events/form/EventFormSchema';

export const useEventFormSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      if (!user) throw new Error('User must be authenticated');

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
      toast({
        title: 'Event created successfully!',
        description: 'Your event has been published and is now visible to others.',
      });
      navigate(`/events/${event.id}`);
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description: 'Please try again or contact support if the problem persists.',
        variant: 'destructive',
      });
    },
  });

  return {
    createEvent: createEventMutation.mutate,
    isCreating: createEventMutation.isPending,
  };
};
