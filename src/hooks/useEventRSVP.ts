
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { safeSpread, asEqParam } from '@/utils/supabaseTypeUtils';
import { Event } from '@/types';

/**
 * Hook for getting and managing event RSVPs
 */
export const useEventRSVP = () => {
  const queryClient = useQueryClient();

  /**
   * Get attendees for a specific event
   */
  const getAttendeesForEvent = useCallback(async (eventId: string) => {
    try {
      console.log('Fetching attendees for event:', eventId);
      
      // Get "Going" attendees - using manual join approach
      const { data: goingData, error: goingError } = await supabase
        .from('event_rsvps')
        .select(`
          user_id
        `)
        .eq('event_id', eventId)
        .eq('status', 'Going');

      if (goingError) {
        console.error('Error fetching Going attendees:', goingError);
        throw goingError;
      }

      // Get "Interested" attendees
      const { data: interestedData, error: interestedError } = await supabase
        .from('event_rsvps')
        .select(`
          user_id
        `)
        .eq('event_id', eventId)
        .eq('status', 'Interested');

      if (interestedError) {
        console.error('Error fetching Interested attendees:', interestedError);
        throw interestedError;
      }

      // Extract user IDs
      const goingUserIds = goingData?.map(item => item.user_id).filter(Boolean) || [];
      const interestedUserIds = interestedData?.map(item => item.user_id).filter(Boolean) || [];
      
      // Fetch profiles for going attendees  
      const { data: goingProfiles, error: goingProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', goingUserIds);
        
      if (goingProfilesError) {
        console.error('Error fetching Going profiles:', goingProfilesError);
      }
      
      // Fetch profiles for interested attendees
      const { data: interestedProfiles, error: interestedProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', interestedUserIds);
        
      if (interestedProfilesError) {
        console.error('Error fetching Interested profiles:', interestedProfilesError);
      }

      console.log(`Event ${eventId} attendees:`, {
        going: goingProfiles?.length || 0,
        interested: interestedProfiles?.length || 0
      });

      return {
        going: goingProfiles || [],
        interested: interestedProfiles || [],
      };
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      return { going: [], interested: [] };
    }
  }, []);

  /**
   * Get friend attendees for a specific event
   */
  const getFriendAttendeesForEvent = useCallback(async (eventId: string, userId: string) => {
    try {
      if (!eventId || !userId) {
        console.log('Missing eventId or userId for friend attendees fetch');
        return { going: [], interested: [] };
      }

      console.log('[DEBUG] Fetching friend attendees for event:', eventId, 'and user:', userId);
      
      // First get the user's friends
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'Accepted');
      
      if (friendshipsError) {
        console.error('[DEBUG] Error fetching friendships:', friendshipsError);
        return { going: [], interested: [] };
      }
      
      console.log('[DEBUG] Friendships found:', friendships?.length || 0);
      
      // Extract friend IDs
      const friendIds = friendships.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      ).filter(Boolean);
      
      if (friendIds.length === 0) {
        console.log('[DEBUG] No friends found for user:', userId);
        return { going: [], interested: [] };
      }
      
      console.log('[DEBUG] Friend IDs:', friendIds);
      
      // Get "Going" friends - using two separate queries
      const { data: goingRsvps, error: goingError } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('status', 'Going')
        .in('user_id', friendIds);
      
      if (goingError) {
        console.error('[DEBUG] Error fetching Going friends RSVPs:', goingError);
        return { going: [], interested: [] };
      }
      
      // Get "Interested" friends
      const { data: interestedRsvps, error: interestedError } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('status', 'Interested')
        .in('user_id', friendIds);
      
      if (interestedError) {
        console.error('[DEBUG] Error fetching Interested friends RSVPs:', interestedError);
        return { going: [], interested: [] };
      }
      
      // Extract user IDs
      const goingFriendIds = goingRsvps?.map(rsvp => rsvp.user_id).filter(Boolean) || [];
      const interestedFriendIds = interestedRsvps?.map(rsvp => rsvp.user_id).filter(Boolean) || [];
      
      // Fetch profile data for going friends
      const { data: goingProfiles, error: goingProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', goingFriendIds);
      
      if (goingProfilesError) {
        console.error('[DEBUG] Error fetching Going friends profiles:', goingProfilesError);
      }
      
      // Fetch profile data for interested friends
      const { data: interestedProfiles, error: interestedProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', interestedFriendIds);
      
      if (interestedProfilesError) {
        console.error('[DEBUG] Error fetching Interested friends profiles:', interestedProfilesError);
      }
      
      console.log('[DEBUG] Friends found - Going:', goingProfiles?.length || 0, 'Interested:', interestedProfiles?.length || 0);
      
      return {
        going: goingProfiles || [],
        interested: interestedProfiles || [],
      };
    } catch (error) {
      console.error('[DEBUG] Error fetching friend attendees:', error);
      return { going: [], interested: [] };
    }
  }, []);

  /**
   * Get the user's RSVP status for a specific event
   */
  const getUserEventRSVP = useCallback(async (userId: string, eventId: string) => {
    if (!userId || !eventId) return null;
    
    try {
      console.log(`Getting RSVP status for userId=${userId}, eventId=${eventId}`);
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (error) {
        console.error('Error getting user event RSVP:', error);
        throw error;
      }
      
      console.log('RSVP status result:', data);
      
      if (data) {
        return {
          id: data.id,
          status: data.status
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user event RSVP:', error);
      return null;
    }
  }, []);

  /**
   * Get all RSVP'd events for a user
   */
  const getUserRsvpedEvents = useCallback(async (userId: string) => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          id, status, event_id,
          events:event_id (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data && Array.isArray(data)) {
        return data.map(item => ({
          id: item.id,
          status: item.status,
          event: item.events
        })).filter(item => item.event);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting user RSVPed events:', error);
      return [];
    }
  }, []);

  /**
   * Add, update, or remove an RSVP
   */
  const updateRSVP = useCallback(async (
    userId: string,
    eventId: string,
    status: 'Going' | 'Interested' | null
  ) => {
    if (!userId || !eventId) return false;
    
    try {
      console.log(`Updating RSVP: userId=${userId}, eventId=${eventId}, status=${status}`);
      
      // Check for existing RSVP
      const { data: existingRsvp, error: fetchError } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      console.log('Existing RSVP:', existingRsvp);
      
      let oldStatus = existingRsvp?.status;
      
      if (status === null) {
        // Remove RSVP if status is null
        if (existingRsvp) {
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);
          
          if (error) throw error;
        }
      } else if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .update({ status })
          .eq('id', existingRsvp.id);
        
        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert({
            user_id: userId,
            event_id: eventId,
            status
          });
        
        if (error) throw error;
      }
      
      // Update caches directly instead of invalidating
      updateCaches(eventId, userId, status, oldStatus);
      
      // Only invalidate the attendees query
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      
      return true;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      return false;
    }
  }, [queryClient]);
  
  // Helper function to update all relevant caches
  const updateCaches = (
    eventId: string,
    userId: string,
    newStatus: 'Going' | 'Interested' | null,
    oldStatus?: string
  ) => {
    // Update the events list cache
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: Event[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(event => {
        if (event.id === eventId) {
          const updatedEvent = { ...event };
          
          // Update the RSVP status
          updatedEvent.rsvp_status = newStatus as any;
          
          // Update attendee counts
          if (!updatedEvent.attendees) {
            updatedEvent.attendees = { going: 0, interested: 0 };
          }
          
          // Adjust counts based on status changes
          if (oldStatus === 'Going' && newStatus !== 'Going') {
            updatedEvent.attendees.going = Math.max(0, updatedEvent.attendees.going - 1);
          }
          if (oldStatus === 'Interested' && newStatus !== 'Interested') {
            updatedEvent.attendees.interested = Math.max(0, updatedEvent.attendees.interested - 1);
          }
          if (newStatus === 'Going' && oldStatus !== 'Going') {
            updatedEvent.attendees.going += 1;
          }
          if (newStatus === 'Interested' && oldStatus !== 'Interested') {
            updatedEvent.attendees.interested += 1;
          }
          
          return updatedEvent;
        }
        return event;
      });
    });
    
    // Update specific event cache
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        rsvp_status: newStatus,
        attendees: {
          ...(oldData.attendees || { going: 0, interested: 0 }),
          going: calculateAttendeeCount(oldData, 'going', oldStatus, newStatus),
          interested: calculateAttendeeCount(oldData, 'interested', oldStatus, newStatus)
        }
      };
    });
    
    // Update user events cache if it exists
    queryClient.setQueriesData({ queryKey: ['user-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      
      // Handle different data shapes based on the query
      if (Array.isArray(oldData)) {
        return oldData.map(item => {
          if (
            (item.event && item.event.id === eventId) || 
            (item.id === eventId)
          ) {
            return {
              ...item,
              rsvp_status: newStatus,
              status: newStatus,
            };
          }
          return item;
        });
      }
      
      return oldData;
    });
  };
  
  // Helper function to calculate new attendee counts
  const calculateAttendeeCount = (
    event: any, 
    type: 'going' | 'interested',
    oldStatus?: string,
    newStatus?: 'Going' | 'Interested' | null
  ) => {
    const currentCount = event.attendees?.[type] || 0;
    
    if (oldStatus === capitalizeFirst(type) && newStatus !== capitalizeFirst(type)) {
      return Math.max(0, currentCount - 1);
    }
    
    if (newStatus === capitalizeFirst(type) && oldStatus !== capitalizeFirst(type)) {
      return currentCount + 1;
    }
    
    return currentCount;
  };
  
  // Helper to capitalize first letter
  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return {
    getAttendeesForEvent,
    getFriendAttendeesForEvent,
    getUserEventRSVP,
    getUserRsvpedEvents,
    updateRSVP
  };
};
