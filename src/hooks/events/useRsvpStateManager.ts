import { useState, useCallback, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'react-router-dom';

// Interface for filter state that needs to be preserved
interface FilterState {
  urlParams: string;
  eventTypes: string[];
  scrollPosition: number;
  timestamp: number;
  pathname: string;
}

export const useRsvpStateManager = (userId: string | undefined) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const filterStateRef = useRef<FilterState | null>(null);
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
          
          // Dispatch event to notify components
          const event = new CustomEvent('filtersRestored', {
            detail: {
              urlParams: storedUrl,
              timestamp: Date.now(),
              source: 'navigation-handler'
            }
          });
          document.dispatchEvent(event);
        }
      }
    };
    
    window.addEventListener('popstate', handleRsvpStateBackup);
    
    return () => {
      window.removeEventListener('popstate', handleRsvpStateBackup);
    };
  }, []);
  
  /**
   * Captures and stores the current filter state before RSVP operation
   */
  const captureFilterState = useCallback(() => {
    const scrollPosition = window.scrollY;
    const currentUrl = window.location.href;
    const urlParams = window.location.search;
    const pathname = window.location.pathname;
    const timestamp = Date.now();
    
    // Parse event types from URL
    const searchParams = new URLSearchParams(urlParams);
    const eventTypes = searchParams.getAll('eventType');
    
    // Create filter state object
    const filterState: FilterState = {
      urlParams,
      eventTypes,
      scrollPosition,
      timestamp,
      pathname
    };
    
    // Store in multiple locations for redundancy
    filterStateRef.current = filterState;
    
    // Store in window for global access
    if (typeof window !== 'undefined') {
      window.rsvpInProgress = true;
      window._filterStateBeforeRsvp = {
        urlParams,
        scrollPosition,
        timestamp,
        eventTypes,
        pathname
      };
      
      // Add comprehensive backup
      window._rsvpStateBackup = {
        filterState,
        urlParams,
        scrollPosition,
        timestamp
      };
    }
    
    // Store in sessionStorage as backup
    try {
      sessionStorage.setItem('rsvpFilterState', JSON.stringify(filterState));
      
      // Also store as a filter state snapshot for recovery
      sessionStorage.setItem('event-filter-state-snapshot', JSON.stringify({
        eventTypes,
        venues: [],
        dateRange: null,
        dateFilter: '',
        urlParams,
        timestamp
      }));
      
      console.log('Filter state captured:', filterState);
    } catch (e) {
      console.error('Failed to save filter state to session storage:', e);
    }
    
    // Add body attribute as visual indicator
    document.body.setAttribute('data-rsvp-in-progress', 'true');
    
    return filterState;
  }, []);
  
  /**
   * Restores the filter state after RSVP operation
   */
  const restoreFilterState = useCallback((delay: number = 100) => {
    setTimeout(() => {
      // First try to get state from ref
      let filterState = filterStateRef.current;
      
      // If not available, try window
      if (!filterState && window._filterStateBeforeRsvp) {
        filterState = {
          urlParams: window._filterStateBeforeRsvp.urlParams,
          eventTypes: window._filterStateBeforeRsvp.eventTypes || [],
          scrollPosition: window._filterStateBeforeRsvp.scrollPosition,
          timestamp: window._filterStateBeforeRsvp.timestamp,
          pathname: window._filterStateBeforeRsvp.pathname || window.location.pathname
        };
      }
      
      // If still not available, try sessionStorage
      if (!filterState) {
        try {
          const stored = sessionStorage.getItem('rsvpFilterState');
          if (stored) {
            filterState = JSON.parse(stored);
          }
        } catch (e) {
          console.error('Failed to restore filter state from session storage:', e);
        }
      }
      
      if (filterState) {
        console.log('Restoring filter state:', filterState);
        
        // Only restore if we're on the events page
        if (window.location.pathname.includes('/events')) {
          // Restore URL params if they changed
          const currentParams = window.location.search;
          if (filterState.urlParams !== currentParams) {
            console.log('URL params changed, restoring:', filterState.urlParams);
            window.history.replaceState({}, '', `${window.location.pathname}${filterState.urlParams}`);
            
            // Store as last restored state
            window._lastRestoredFilterState = {
              urlParams: filterState.urlParams,
              eventTypes: filterState.eventTypes,
              timestamp: Date.now()
            };
            
            // Emit custom event to notify components about the filter restoration
            const filterRestoredEvent = new CustomEvent('filtersRestored', { 
              detail: { 
                urlParams: filterState.urlParams,
                eventTypes: filterState.eventTypes,
                timestamp: Date.now(),
                source: 'rsvp-state-manager'
              } 
            });
            document.dispatchEvent(filterRestoredEvent);
          }
          
          // Restore scroll position if it changed significantly
          const scrollDiff = Math.abs(window.scrollY - filterState.scrollPosition);
          if (scrollDiff > 50) {
            console.log(`Scroll changed, restoring to ${filterState.scrollPosition}px`);
            window.scrollTo({ top: filterState.scrollPosition, behavior: 'auto' });
          }
        }
      }
      
      // Clear state
      filterStateRef.current = null;
      
      // Reset global flags
      if (typeof window !== 'undefined') {
        window.rsvpInProgress = false;
        window._filterStateBeforeRsvp = undefined;
        
        // Keep the backup for a bit longer in case of navigation
        setTimeout(() => {
          window._rsvpStateBackup = undefined;
        }, 5000);
      }
      
      // Remove body attribute
      document.body.removeAttribute('data-rsvp-in-progress');
      
    }, delay);
  }, []);

  /**
   * Surgically updates cache without invalidating queries
   */
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
      
      // Step 1: Capture current state
      const capturedState = captureFilterState();
      console.log('Starting RSVP with captured state:', capturedState);
      
      // Update backup with event details
      if (window._rsvpStateBackup) {
        window._rsvpStateBackup.eventId = eventId;
        window._rsvpStateBackup.status = status;
      }
      
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
      
      // Step 5: Restore state with a delay to ensure proper timing
      restoreFilterState(250);
      
      return result;
    } catch (error) {
      console.error('Error in RSVP operation:', error);
      // Still try to restore state even if there's an error
      restoreFilterState(100);
      return false;
    } finally {
      // Add a slight delay before resetting processing state for UI feedback
      setTimeout(() => {
        setIsProcessing(false);
        setLoadingEventId(null);
      }, 300);
    }
  }, [userId, isProcessing, captureFilterState, restoreFilterState, updateCaches]);

  return {
    handleRsvp,
    isProcessing,
    loadingEventId
  };
};
