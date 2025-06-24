
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEventRSVP } from '@/hooks/useEventRSVP';

export const useEventRsvpHandler = (eventId: string) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [rsvpLoading, setRsvpLoading] = useState<boolean>(false);
  const { updateRSVP, getUserEventRSVP } = useEventRSVP();

  // Add cleanup for transition effects
  useEffect(() => {
    return () => {
      document.body.classList.remove('rsvp-transition');
      document.body.classList.remove('rsvp-transition-active');
    };
  }, []);

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user || !isAuthenticated) {
      // Redirect to login without toast message
      navigate('/login');
      return false;
    }

    try {
      if (!eventId) {
        console.error("Error: Event ID is missing.");
        return false;
      }

      setRsvpLoading(true);
      console.log(`useEventRsvpHandler: RSVP to event ${eventId} with status ${status}`);
      
      // Show transition indicator
      document.body.classList.add('rsvp-transition');
      document.querySelector('.rsvp-transition-indicator')?.classList.add('active');
      
      // Apply fade effect to main content
      const mainContent = document.querySelector('.event-detail-card');
      if (mainContent) {
        mainContent.classList.add('event-content-refreshing');
      }
      
      // First check current RSVP status to determine the action
      const currentRsvp = await getUserEventRSVP(user.id, eventId);
      
      let newStatus: 'Going' | 'Interested' | null = status;
      
      // If user already has this status, toggle it off
      if (currentRsvp && currentRsvp.status === status) {
        newStatus = null; // Remove RSVP
      }
      
      // Perform the RSVP update
      const result = await updateRSVP(user.id, eventId, newStatus);
      
      console.log(`RSVP operation result: ${result}, new status: ${newStatus}`);
      return result;
    } catch (err) {
      console.error('Error in RSVP process:', err);
      return false;
    } finally {
      // Add a small delay to make transitions smoother
      setTimeout(() => {
        setRsvpLoading(false);
        document.body.classList.remove('rsvp-transition');
        document.querySelector('.rsvp-transition-indicator')?.classList.remove('active');
        
        // Remove content refreshing class
        const mainContent = document.querySelector('.event-detail-card');
        if (mainContent) {
          mainContent.classList.remove('event-content-refreshing');
        }
      }, 800); // Longer delay for smoother transition
    }
  };

  return {
    handleRsvp,
    rsvpLoading
  };
};
