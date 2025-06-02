
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export type CasualPlanRsvpStatus = 'Going' | 'Interested' | null;

export const useCasualPlanRsvpHandler = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleRsvp = async (planId: string, status: CasualPlanRsvpStatus): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return false;
    }

    setLoadingPlanId(planId);

    try {
      // Check if user already has an RSVP for this plan
      const { data: existingRsvp } = await supabase
        .from('casual_plan_rsvps')
        .select('*')
        .eq('plan_id', planId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingRsvp) {
        // Update existing RSVP if status is different, otherwise remove it
        if (existingRsvp.status !== status) {
          const { error } = await supabase
            .from('casual_plan_rsvps')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', existingRsvp.id);

          if (error) {
            console.error('Error updating casual plan RSVP:', error);
            return false;
          }
        } else {
          // Remove RSVP if clicking the same status
          const { error } = await supabase
            .from('casual_plan_rsvps')
            .delete()
            .eq('id', existingRsvp.id);

          if (error) {
            console.error('Error removing casual plan RSVP:', error);
            return false;
          }
        }
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('casual_plan_rsvps')
          .insert([{ 
            plan_id: planId, 
            user_id: user.id, 
            status 
          }]);

        if (error) {
          console.error('Error creating casual plan RSVP:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in casual plan RSVP process:', error);
      return false;
    } finally {
      setLoadingPlanId(null);
    }
  };

  return {
    handleRsvp,
    loadingPlanId,
    isLoading: !!loadingPlanId
  };
};
