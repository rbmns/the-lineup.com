
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useUnifiedRsvp = () => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateEventCaches = useCallback((eventId: string, newStatus: 'Going' | 'Interested' | null) => {
    console.log(`Updating all caches for event ${eventId} with status: ${newStatus}`);
    
    // Update individual event cache immediately with proper structure
    queryClient.setQueryData(['event', eventId, user?.id], (oldData: any) => {
      if (!oldData) return oldData;
      const updated = { ...oldData, rsvp_status: newStatus };
      console.log(`Updated individual event cache for ${eventId}: ${newStatus}`);
      return updated;
    });

    // Also update cache without user ID for backward compatibility
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      const updated = { ...oldData, rsvp_status: newStatus };
      console.log(`Updated individual event cache (no user) for ${eventId}: ${newStatus}`);
      return updated;
    });

    // Update ALL events queries - this is key for the events page
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      // Handle array format
      if (Array.isArray(oldData)) {
        const updated = oldData.map((event: any) => {
          if (event.id === eventId) {
            console.log(`Updated event in array cache: ${eventId} to ${newStatus}`);
            return { ...event, rsvp_status: newStatus };
          }
          return event;
        });
        return updated;
      }
      
      // Handle object format with data property
      if (oldData.data && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: oldData.data.map((event: any) => {
            if (event.id === eventId) {
              console.log(`Updated event in object.data cache: ${eventId} to ${newStatus}`);
              return { ...event, rsvp_status: newStatus };
            }
            return event;
          })
        };
      }
      
      return oldData;
    });

    // Update events-page-data cache specifically (this is what the events page uses)
    queryClient.setQueryData(['events-page-data'], (oldData: any) => {
      if (!oldData) return oldData;
      
      // Handle array format
      if (Array.isArray(oldData)) {
        const updated = oldData.map((event: any) => {
          if (event.id === eventId) {
            console.log(`Updated event in events-page-data cache: ${eventId} to ${newStatus}`);
            return { ...event, rsvp_status: newStatus };
          }
          return event;
        });
        return updated;
      }
      
      // Handle object format with events property
      if (oldData.events && Array.isArray(oldData.events)) {
        return {
          ...oldData,
          events: oldData.events.map((event: any) => {
            if (event.id === eventId) {
              console.log(`Updated event in events-page-data.events cache: ${eventId} to ${newStatus}`);
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
      
      const updated = oldData.map((event: any) => {
        if (event.id === eventId) {
          console.log(`Updated event in filtered cache: ${eventId} to ${newStatus}`);
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
      return updated;
    });

    // Update user events cache
    if (user?.id) {
      queryClient.setQueryData(['userEvents', user.id], (oldData: any) => {
        if (!oldData) return oldData;
        
        const updateEventsList = (events: any[]) => {
          if (!events || !Array.isArray(events)) return events;
          return events.map((event: any) => {
            if (event.id === eventId) {
              console.log(`Updated event in user events cache: ${eventId} to ${newStatus}`);
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

    // Invalidate specific queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
    
    // Broadcast cache update to other components
    window.dispatchEvent(new CustomEvent('rsvpCacheUpdated', { 
      detail: { eventId, newStatus } 
    }));

    console.log(`Cache update complete for event ${eventId} with status ${newStatus}`);
  }, [queryClient, user?.id]);

  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user?.id) {
      console.log("User not authenticated for RSVP");
      return false;
    }

    console.log(`Starting RSVP process for event ${eventId} with status ${status}`);
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
      let actionTaken = '';

      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // Toggle off - remove RSVP
          const { error: deleteError } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (deleteError) throw deleteError;
          newStatus = null;
          actionTaken = 'removed';
          console.log(`RSVP removed for event ${eventId}`);
        } else {
          // Update to new status
          const { error: updateError } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);

          if (updateError) throw updateError;
          actionTaken = 'updated';
          console.log(`RSVP updated for event ${eventId} from ${existingRsvp.status} to ${status}`);
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
        actionTaken = 'created';
        console.log(`New RSVP created for event ${eventId} with status ${status}`);
      }

      // Update all relevant caches immediately and synchronously
      updateEventCaches(eventId, newStatus);

      return true;
    } catch (error) {
      console.error("Error updating RSVP:", error);
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
