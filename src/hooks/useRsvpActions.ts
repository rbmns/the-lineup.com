
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

export const useRsvpActions = (userId?: string) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    setLoading(true);
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return false;
    }

    try {
      // First check if the user already has an RSVP for this event
      const { data: existingRsvp } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingRsvp) {
        // Update the existing RSVP if the status is different
        if (existingRsvp.status !== status) {
          const { error } = await supabase
            .from('event_rsvps')
            .update({ status })
            .eq('id', existingRsvp.id);

          if (error) {
            console.error('Error updating RSVP:', error);
            toast.error('Failed to update RSVP status');
            setLoading(false);
            return false;
          }
          
          toast.success(`RSVP updated to ${status}`);
          setLoading(false);
          return true;
        } else {
          // If clicking the same status, remove the RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (error) {
            console.error('Error removing RSVP:', error);
            toast.error('Failed to remove RSVP');
            setLoading(false);
            return false;
          }
          
          toast.success('RSVP removed');
          setLoading(false);
          return true;
        }
      } else {
        // Create a new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ event_id: eventId, user_id: user.id, status }]);

        if (error) {
          console.error('Error creating RSVP:', error);
          toast.error('Failed to create RSVP');
          setLoading(false);
          return false;
        }
        
        toast.success(`RSVP status set to ${status}`);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Error in RSVP process:', error);
      toast.error('Error updating RSVP status');
      setLoading(false);
      return false;
    }
  };

  return { 
    handleRsvp,
    loading
  };
};
