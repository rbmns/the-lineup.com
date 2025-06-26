
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useUnifiedRsvp = () => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateEventCaches = useCallback((eventId: string, newStatus: 'Going' | 'Interested' | null) => {
    console.log(`Updating cache for event ${eventId} with status: ${newStatus}`);
    
    // Update individual event cache immediately
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      console.log(`Updated individual event cache for ${eventId}`);
      return { ...oldData, rsvp_status: newStatus };
    });

    // Update events list cache immediately - handle multiple formats
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      // Handle array format
      if (Array.isArray(oldData)) {
        return oldData.map((event: any) => {
          if (event.id === eventId) {
            console.log(`Updated event in array cache: ${eventId}`);
            return { ...event, rsvp_status: newStatus };
          }
          return event;
        });
      }
      
      // Handle object format with data property
      if (oldData.data && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: oldData.data.map((event: any) => {
            if (event.id === eventId) {
              console.log(`Updated event in object.data cache: ${eventId}`);
              return { ...event, rsvp_status: newStatus };
            }
            return event;
          })
        };
      }
      
      return oldData;
    });

    // Update filtered events cache
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      
      return oldData.map((event: any) => {
        if (event.id === eventId) {
          console.log(`Updated event in filtered cache: ${eventId}`);
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
    });

    // Update user events cache
    if (user?.id) {
      queryClient.setQueryData(['userEvents', user.id], (oldData: any) => {
        if (!oldData) return oldData;
        
        const updateEventsList = (events: any[]) => {
          if (!events || !Array.isArray(events)) return events;
          return events.map((event: any) => {
            if (event.id === eventId) {
              console.log(`Updated event in user events cache: ${eventId}`);
              return { ...event, rsvp_status: newStatus };
            }
            return event;
          });
        };

        return {
          ...oldData,
          upcomingEvents: updateEventsList(oldData.upcomingEvents),
          pastEvents: updateEventsList(oldData.pastEvents)
        };
      });
    }

    // Synchronously invalidate specific queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
    
    // Broadcast cache update to other components
    window.dispatchEvent(new CustomEvent('rsvpCacheUpdated', { 
      detail: { eventId, newStatus } 
    }));
  }, [queryClient, user?.id]);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP to events",
        variant: "destructive"
      });
      return false;
    }

    setLoadingEventId(eventId);

    try {
      // Check existing RSVP
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing RSVP:', checkError);
        throw checkError;
      }

      let newStatus: 'Going' | 'Interested' | null = status;

      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // Toggle off - remove RSVP
          const { error: deleteError } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (deleteError) throw deleteError;
          newStatus = null;
        } else {
          // Update to new status
          const { error: updateError } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);

          if (updateError) throw updateError;
        }
      } else {
        // Create new RSVP
        const { error: insertError } = await supabase
          .from('event_rsvps')
          .insert([{ 
            user_id: user.id, 
            event_id: eventId, 
            status 
          }]);

        if (insertError) throw insertError;
      }

      // Update all relevant caches immediately and synchronously
      updateEventCaches(eventId, newStatus);

      toast({
        title: "RSVP updated",
        description: newStatus ? `You are now ${newStatus.toLowerCase()} to this event` : "RSVP removed"
      });

      return true;
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "Error",
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoadingEventId(null);
    }
  }, [user?.id, updateEventCaches]);

  return {
    handleRsvp,
    loadingEventId
  };
};
