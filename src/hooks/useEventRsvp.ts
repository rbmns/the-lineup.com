
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UseEventRsvpOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useEventRsvp = ({ onSuccess, onError }: UseEventRsvpOptions = {}) => {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!eventId) return false;
    
    try {
      setLoadingEventId(eventId);
      
      const { data: existingRsvp, error: fetchError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (existingRsvp) {
        // Update existing RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .update({ 
            status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingRsvp.id);
        
        if (error) throw error;
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .insert({
            event_id: eventId,
            status,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      toast({
        title: `${status === 'Going' ? 'Going to event' : 'Interested in event'}`,
        description: "Your RSVP has been saved"
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error setting RSVP status:', error);
      
      toast({
        title: "Error saving RSVP",
        description: "Please try again later",
        variant: "destructive"
      });
      
      if (onError && error instanceof Error) onError(error);
      return false;
    } finally {
      setLoadingEventId(null);
    }
  };

  return {
    handleRsvp,
    loadingEventId
  };
};

export default useEventRsvp;
