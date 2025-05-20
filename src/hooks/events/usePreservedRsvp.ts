
import { useState, useRef, useEffect } from 'react';
import { useRsvpActions } from '@/hooks/event-rsvp/useRsvpActions';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const usePreservedRsvp = (userId: string | undefined) => {
  const { handleRsvp: originalHandleRsvp, loading } = useRsvpActions(userId);
  const { savePosition, restorePosition } = useScrollPosition();
  const [rsvpInProgress, setRsvpInProgress] = useState(false);
  const filterStateRef = useRef<{
    urlParams: string;
    eventTypes: string[];
    timestamp: number;
  } | null>(null);

  // Listen for filter restoration events
  useEffect(() => {
    const handleFilterRestoration = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Filter restoration event detected in usePreservedRsvp:', customEvent.detail);
      
      // Check if we have saved filter state and compare with restored state
      if (filterStateRef.current) {
        console.log('Comparing saved filter state:', filterStateRef.current);
        console.log('With restored filter state:', customEvent.detail);
      }
    };
    
    document.addEventListener('filtersRestored', handleFilterRestoration);
    
    return () => {
      document.removeEventListener('filtersRestored', handleFilterRestoration);
    };
  }, []);

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!userId || rsvpInProgress) {
      console.log("RSVP operation skipped: user not logged in or operation in progress");
      return false;
    }

    try {
      setRsvpInProgress(true);
      
      // Save current filter state and scroll position
      const scrollPosition = savePosition();
      const currentUrlParams = window.location.search;
      const currentEventTypes = new URLSearchParams(currentUrlParams).getAll('eventType');
      
      // Store filter state for potential restoration
      filterStateRef.current = {
        urlParams: currentUrlParams,
        eventTypes: currentEventTypes,
        timestamp: Date.now()
      };
      
      // Save to sessionStorage as extra backup
      try {
        sessionStorage.setItem('rsvpFilterStateComplete', JSON.stringify({
          ...filterStateRef.current,
          scrollPosition,
          pathname: window.location.pathname
        }));
      } catch (e) {
        console.error('Failed to save complete filter state to session storage:', e);
      }
      
      console.log(`PreservedRsvp - Saved filter state: ${scrollPosition}px, URL params: ${currentUrlParams}`);
      
      // Set global flag to prevent unwanted state resets
      if (typeof window !== 'undefined') {
        window.rsvpInProgress = true;
        document.body.setAttribute('data-rsvp-in-progress', 'true');
        
        // Store in window for potential restoration
        window._filterStateBeforeRsvp = {
          urlParams: currentUrlParams,
          scrollPosition,
          timestamp: Date.now()
        };
      }
      
      // Visual feedback animation starts
      const animatedElement = document.querySelector(`[data-event-id="${eventId}"]`);
      if (animatedElement) {
        animatedElement.classList.add('animate-pulse');
      }
      
      // Perform the RSVP action
      const result = await originalHandleRsvp(eventId, status);
      
      // Add delay to ensure UI updates complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check if URL parameters changed during the RSVP operation
      const currentParams = window.location.search;
      if (currentUrlParams !== currentParams && window.location.pathname.includes('/events')) {
        console.log('Filter state changed during RSVP, restoring URL params:', currentUrlParams);
        window.history.replaceState({}, '', `${window.location.pathname}${currentUrlParams}`);
        
        // Emit event to help components update their state
        const filterRestoredEvent = new CustomEvent('filtersRestored', { 
          detail: { 
            urlParams: currentUrlParams,
            eventTypes: currentEventTypes
          } 
        });
        document.dispatchEvent(filterRestoredEvent);
      }
      
      // Restore scroll position
      restorePosition(scrollPosition);
      
      // Extra scroll restoration for reliability
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
        
        // Remove animation
        if (animatedElement) {
          animatedElement.classList.remove('animate-pulse');
        }
      }, 250);
      
      return result;
    } catch (error) {
      console.error("Error in preserved RSVP handler:", error);
      return false;
    } finally {
      // Reset global flags
      if (typeof window !== 'undefined') {
        window.rsvpInProgress = false;
        document.body.removeAttribute('data-rsvp-in-progress');
        
        // Remove URL change block listeners if they exist
        if (window._rsvpBlockUrlChangeListener) {
          window.removeEventListener('popstate', window._rsvpBlockUrlChangeListener, true);
          window.removeEventListener('pushstate', window._rsvpBlockUrlChangeListener, true);
          delete window._rsvpBlockUrlChangeListener;
        }
      }
      
      // Add a delay to prevent multiple rapid RSVP clicks
      setTimeout(() => {
        setRsvpInProgress(false);
        filterStateRef.current = null;
      }, 400);
    }
  };

  return {
    handleRsvp,
    loading,
    rsvpInProgress
  };
};
