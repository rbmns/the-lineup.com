
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export const useEventRsvpHandler = (eventId: string) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [rsvpLoading, setRsvpLoading] = useState<boolean>(false);

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
      
      // First check if the user already has an RSVP for this event
      const { data: existingRsvp } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      let result = false;

      if (existingRsvp) {
        // Update the existing RSVP if the status is different
        if (existingRsvp.status !== status) {
          const { error } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);

          result = !error;
        } else {
          // If clicking the same status, remove the RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          result = !error;
        }
      } else {
        // Create a new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ event_id: eventId, user_id: user.id, status }]);

        result = !error;
      }
      
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
