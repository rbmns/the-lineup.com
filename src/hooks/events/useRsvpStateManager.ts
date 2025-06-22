import { useState, useCallback, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'react-router-dom';

export const useRsvpStateManager = (userId: string | undefined) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const location = useLocation();
  
  // Add listener for URL changes that might happen during RSVP
  useEffect(() => {
    const handleRsvpStateBackup = () => {
      // When navigation occurs during RSVP, check if we have a state backup
      if (window._rsvpStateBackup && 
          Date.now() - window._rsvpStateBackup.timestamp < 5000) {
        console.log('Detected navigation during RSVP, restoring state from backup');
        
        // Restore URL if we're on events page
        if (window.location.pathname.includes('/events')) {
          const storedUrl = window._rsvpStateBackup.urlParams;
          if (storedUrl && window.location.search !== storedUrl) {
            console.log('Restoring URL from backup:', storedUrl);
            window.history.replaceState({}, '', `${window.location.pathname}${storedUrl}`);
          }
        }
      }
    };
    
    window.addEventListener('popstate', handleRsvpStateBackup);
    
    // Listen for RSVP start events to capture filter state
    const handleRsvpStart = () => {
      // Implementation for saving filter state
    };
    
    document.addEventListener('rsvpStarted', handleRsvpStart);
    
    return () => {
      window.removeEventListener('popstate', handleRsvpStateBackup);
      document.removeEventListener('rsvpStarted', handleRsvpStart);
    };
  }, []);
  
  // Surgically updates cache without invalidating queries
  const updateCaches = useCallback((eventId: string, newStatus: string | null) => {
    console.log(`Updating cache for event ${eventId}, new status: ${newStatus}`);
    
    // Update specific event cache
    queryClient.setQueryData(['event', eventId], (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, rsvp_status: newStatus };
    });
    
    // Update events list caches without full invalidation
    const updateEventInList = (events: any[]) => {
      if (!events || !Array.isArray(events)) return events;
      
      return events.map((event: any) => {
        if (event.id === eventId) {
          return { ...event, rsvp_status: newStatus };
        }
        return event;
      });
    };
    
    // Update various query cache formats
    queryClient.setQueriesData({ queryKey: ['events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return updateEventInList(oldData);
      } else if (oldData.pages) {
        // Handle infinite query format
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            if (Array.isArray(page)) {
              return updateEventInList(page);
            } else if (page.data && Array.isArray(page.data)) {
              return {
                ...page,
                data: updateEventInList(page.data)
              };
            }
            return page;
          })
        };
      }
      return oldData;
    });
    
    // Also update filtered-events cache if it exists
    queryClient.setQueriesData({ queryKey: ['filtered-events'] }, (oldData: any) => {
      if (!oldData) return oldData;
      if (Array.isArray(oldData)) {
        return updateEventInList(oldData);
      }
      return oldData;
    });
  }, [queryClient]);

  /**
   * Main RSVP handler that orchestrates the entire RSVP process
   */
  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId) {
      console.log('No user ID provided, cannot RSVP');
      return false;
    }
    
    if (isProcessing) {
      console.log('RSVP already in progress, ignoring');
      return false;
    }
    
    try {
      setIsProcessing(true);
      setLoadingEventId(eventId);
      
      // Step 2: Check existing RSVP
      const { data: existingRsvp, error: checkError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      let result = false;
      let newStatus: string | null = status;
      
      // Step 3: Perform RSVP operation based on existing state
      if (existingRsvp) {
        if (existingRsvp.status === status) {
          // Toggle off - remove RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);
            
          if (error) throw error;
          newStatus = null;
          result = true;
        } else {
          // Update to new status
          const { error } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);
            
          if (error) throw error;
          result = true;
        }
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ 
            event_id: eventId, 
            user_id: userId, 
            status 
          }]);
          
        if (error) throw error;
        result = true;
      }
      
      // Step 4: Update cache without invalidating queries
      updateCaches(eventId, newStatus);
      
      return result;
    } catch (error) {
      console.error('Error in RSVP operation:', error);
      return false;
    } finally {
      // Add a slight delay before resetting processing state for UI feedback
      setTimeout(() => {
        setIsProcessing(false);
        setLoadingEventId(null);
        
        // Also reset the global RSVP flag
        if (typeof window !== 'undefined') {
          window.rsvpInProgress = false;
          document.body.removeAttribute('data-rsvp-in-progress');
        }
      }, 300);
    }
  }, [userId, isProcessing, updateCaches]);

  return {
    handleRsvp,
    isProcessing,
    loadingEventId
  };
};
