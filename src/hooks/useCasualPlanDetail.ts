
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
  const [isMarkingInterested, setIsMarkingInterested] = useState(false);
  const [isUnmarkingInterested, setIsUnmarkingInterested] = useState(false);

  const fetchPlanDetail = async () => {
    if (!planId) {
      setError('No plan ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch the plan first
      const { data: planData, error: planError } = await supabase
        .from('casual_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      if (!planData) {
        setError('Plan not found');
        setIsLoading(false);
        return;
      }

      // Fetch creator profile separately
      const { data: creatorProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', planData.creator_id)
        .single();

      if (profileError) {
        console.error('Error fetching creator profile:', profileError);
      }

      // Get attendee count
      const { count: attendeeCount } = await supabase
        .from('casual_plan_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', planId);

      // Get interested count
      const { count: interestedCount } = await supabase
        .from('casual_plan_interests')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', planId);

      // Check if current user is attending and/or interested (if authenticated)
      let userAttending = false;
      let userInterested = false;
      if (user) {
        const { data: userAttendeeData } = await supabase
          .from('casual_plan_attendees')
          .select('id')
          .eq('plan_id', planId)
          .eq('user_id', user.id)
          .single();

        const { data: userInterestedData } = await supabase
          .from('casual_plan_interests')
          .select('id')
          .eq('plan_id', planId)
          .eq('user_id', user.id)
          .single();

        userAttending = !!userAttendeeData;
        userInterested = !!userInterestedData;
      }

      const enhancedPlan: CasualPlan = {
        ...planData,
        creator_profile: creatorProfile || undefined,
        attendee_count: attendeeCount || 0,
        interested_count: interestedCount || 0,
        user_attending: userAttending,
        user_interested: userInterested
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

  const markInterested = async (planId: string) => {
    if (!user) return;

    setIsMarkingInterested(true);
    try {
      const { error } = await supabase
        .from('casual_plan_interests')
        .insert({
          plan_id: planId,
          user_id: user.id
        });

      if (error) throw error;

      // Refresh the plan data
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error marking as interested:', error);
      throw error;
    } finally {
      setIsMarkingInterested(false);
    }
  };

  const unmarkInterested = async (planId: string) => {
    if (!user) return;

    setIsUnmarkingInterested(true);
    try {
      const { error } = await supabase
        .from('casual_plan_interests')
        .delete()
        .eq('plan_id', planId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh the plan data
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error unmarking as interested:', error);
      throw error;
    } finally {
      setIsUnmarkingInterested(false);
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
    markInterested,
    unmarkInterested,
    isJoining,
    isLeaving,
    isMarkingInterested,
    isUnmarkingInterested,
    refetch: fetchPlanDetail
  };
};
