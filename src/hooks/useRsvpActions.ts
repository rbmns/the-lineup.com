
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useRsvpActions = (userId?: string) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to RSVP to events",
        variant: "destructive",
      });
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
            toast({
              title: "RSVP Error",
              description: "Failed to update your RSVP status",
              variant: "destructive",
            });
            return false;
          }

          toast({
            title: "RSVP Updated",
            description: `You're now marked as ${status}`,
            variant: "default",
          });
          return true;
        } else {
          // If clicking the same status, remove the RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (error) {
            console.error('Error removing RSVP:', error);
            toast({
              title: "RSVP Error",
              description: "Failed to remove your RSVP",
              variant: "destructive",
            });
            return false;
          }

          toast({
            title: "RSVP Removed",
            description: "Your RSVP has been removed",
            variant: "default",
          });
          return true;
        }
      } else {
        // Create a new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ event_id: eventId, user_id: user.id, status }]);

        if (error) {
          console.error('Error creating RSVP:', error);
          toast({
            title: "RSVP Error",
            description: `Failed to mark you as ${status}`,
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "RSVP Confirmed",
          description: `You're now marked as ${status}`,
          variant: "default",
        });
        return true;
      }
    } catch (error) {
      console.error('Error in RSVP process:', error);
      toast({
        title: "RSVP Error",
        description: "Failed to update RSVP status",
        variant: "destructive",
      });
      return false;
    }
  };

  return { 
    handleRsvp,
    loading: false // Add a loading state property
  };
};
