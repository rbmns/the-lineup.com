
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CasualPlan } from '@/types/casual-plans';

export const useCasualPlanDetail = (planId?: string) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<CasualPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const fetchPlanDetail = async () => {
    if (!planId) {
      setError('No plan ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch the plan with creator profile
      const { data: planData, error: planError } = await supabase
        .from('casual_plans')
        .select(`
          *,
          creator_profile:profiles!casual_plans_creator_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      if (!planData) {
        setError('Plan not found');
        setIsLoading(false);
        return;
      }

      // Get attendee count
      const { count: attendeeCount } = await supabase
        .from('casual_plan_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', planId);

      // Check if current user is attending (if authenticated)
      let userAttending = false;
      if (user) {
        const { data: userAttendeeData } = await supabase
          .from('casual_plan_attendees')
          .select('id')
          .eq('plan_id', planId)
          .eq('user_id', user.id)
          .single();

        userAttending = !!userAttendeeData;
      }

      const enhancedPlan: CasualPlan = {
        ...planData,
        attendee_count: attendeeCount || 0,
        user_attending: userAttending
      };

      setPlan(enhancedPlan);
    } catch (err) {
      console.error('Error fetching plan detail:', err);
      setError('Failed to load plan details');
    } finally {
      setIsLoading(false);
    }
  };

  const joinPlan = async (planId: string) => {
    if (!user) return;

    setIsJoining(true);
    try {
      const { error } = await supabase
        .from('casual_plan_attendees')
        .insert({
          plan_id: planId,
          user_id: user.id
        });

      if (error) throw error;

      // Refresh the plan data
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error joining plan:', error);
      throw error;
    } finally {
      setIsJoining(false);
    }
  };

  const leavePlan = async (planId: string) => {
    if (!user) return;

    setIsLeaving(true);
    try {
      const { error } = await supabase
        .from('casual_plan_attendees')
        .delete()
        .eq('plan_id', planId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh the plan data
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error leaving plan:', error);
      throw error;
    } finally {
      setIsLeaving(false);
    }
  };

  useEffect(() => {
    fetchPlanDetail();
  }, [planId, user]);

  return {
    plan,
    isLoading,
    error,
    joinPlan,
    leavePlan,
    isJoining,
    isLeaving,
    refetch: fetchPlanDetail
  };
};
