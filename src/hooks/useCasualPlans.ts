
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CasualPlan, CreateCasualPlanData } from '@/types/casual-plans';
import { useAuth } from '@/contexts/AuthContext';

export const useCasualPlans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch casual plans with attendee information
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['casual-plans'],
    queryFn: async () => {
      const { data: plansData, error: plansError } = await supabase
        .from('casual_plans')
        .select(`
          *,
          creator_profile:creator_id(id, username, avatar_url),
          attendees:casual_plan_attendees(
            id,
            user_id,
            user_profile:user_id(id, username, avatar_url)
          )
        `)
        .gte('date', new Date().toISOString().split('T')[0]) // Only future plans
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (plansError) throw plansError;

      // Transform the data to include attendee count and user attendance status
      const transformedPlans: CasualPlan[] = (plansData || []).map(plan => {
        // Handle creator_profile which might be null or have an error
        const creator_profile = plan.creator_profile && typeof plan.creator_profile === 'object' && !('error' in plan.creator_profile)
          ? {
              id: plan.creator_profile.id,
              username: plan.creator_profile.username,
              avatar_url: plan.creator_profile.avatar_url
            }
          : undefined;

        return {
          ...plan,
          creator_profile,
          attendee_count: plan.attendees?.length || 0,
          user_attending: user ? plan.attendees?.some(att => att.user_id === user.id) : false
        };
      });

      return transformedPlans;
    },
  });

  // Create a new casual plan
  const createPlanMutation = useMutation({
    mutationFn: async (planData: CreateCasualPlanData) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('casual_plans')
        .insert({
          ...planData,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
    },
  });

  // Join a casual plan
  const joinPlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('casual_plan_attendees')
        .insert({
          plan_id: planId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
    },
  });

  // Leave a casual plan
  const leavePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user) throw new Error('User must be logged in');

      const { error } = await supabase
        .from('casual_plan_attendees')
        .delete()
        .eq('plan_id', planId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
    },
  });

  return {
    plans: plans || [],
    isLoading,
    error,
    createPlan: createPlanMutation.mutate,
    joinPlan: joinPlanMutation.mutate,
    leavePlan: leavePlanMutation.mutate,
    isCreating: createPlanMutation.isPending,
    isJoining: joinPlanMutation.isPending,
    isLeaving: leavePlanMutation.isPending,
  };
};
