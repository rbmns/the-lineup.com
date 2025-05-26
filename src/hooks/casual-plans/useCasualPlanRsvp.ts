
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useCasualPlanRsvp = () => {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleJoinPlan = async (planId: string, userId: string): Promise<boolean> => {
    if (loadingPlanId) return false;
    
    setLoadingPlanId(planId);
    console.log(`Joining casual plan: ${planId} for user: ${userId}`);
    
    try {
      // Check if user is already attending
      const { data: existingAttendance, error: checkError } = await supabase
        .from('casual_plan_attendees')
        .select('id')
        .eq('plan_id', planId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing attendance:', checkError);
        return false;
      }

      if (existingAttendance) {
        console.log('User already attending this plan');
        return true;
      }

      // Join the plan
      const { error: joinError } = await supabase
        .from('casual_plan_attendees')
        .insert({
          plan_id: planId,
          user_id: userId
        });

      if (joinError) {
        console.error('Error joining plan:', joinError);
        return false;
      }

      console.log('Successfully joined plan');
      return true;
    } catch (error) {
      console.error('Error in handleJoinPlan:', error);
      return false;
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleLeavePlan = async (planId: string, userId: string): Promise<boolean> => {
    if (loadingPlanId) return false;
    
    setLoadingPlanId(planId);
    console.log(`Leaving casual plan: ${planId} for user: ${userId}`);
    
    try {
      const { error: leaveError } = await supabase
        .from('casual_plan_attendees')
        .delete()
        .eq('plan_id', planId)
        .eq('user_id', userId);

      if (leaveError) {
        console.error('Error leaving plan:', leaveError);
        return false;
      }

      console.log('Successfully left plan');
      return true;
    } catch (error) {
      console.error('Error in handleLeavePlan:', error);
      return false;
    } finally {
      setLoadingPlanId(null);
    }
  };

  return {
    handleJoinPlan,
    handleLeavePlan,
    loadingPlanId,
    isLoading: !!loadingPlanId
  };
};
