
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateCasualPlanData } from '@/types/casual-plans';
import { useAuth } from '@/contexts/AuthContext';

export const useCasualPlansMutations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Create a new casual plan
  const createPlanMutation = useMutation({
    mutationFn: async (planData: CreateCasualPlanData) => {
      if (!user) throw new Error('User must be logged in');

      console.log('Creating plan with data:', planData);

      // Ensure location is properly set
      const planToCreate = {
        ...planData,
        creator_id: user.id,
        location: planData.location || '', // Ensure location is never null
        location_coordinates: planData.location_coordinates || null,
      };

      console.log('Plan data being inserted:', planToCreate);

      const { data, error } = await supabase
        .from('casual_plans')
        .insert(planToCreate)
        .select()
        .single();

      if (error) {
        console.error('Error creating plan:', error);
        throw error;
      }

      console.log('Plan created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Plan creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['casual-plans-raw'] });
      queryClient.invalidateQueries({ queryKey: ['casual-plan-attendees'] });
    },
    onError: (error) => {
      console.error('Plan creation failed:', error);
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
      queryClient.invalidateQueries({ queryKey: ['casual-plan-attendees'] });
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
      queryClient.invalidateQueries({ queryKey: ['casual-plan-attendees'] });
    },
  });

  return {
    createPlan: createPlanMutation.mutate,
    joinPlan: joinPlanMutation.mutate,
    leavePlan: leavePlanMutation.mutate,
    isCreating: createPlanMutation.isPending,
    isJoining: joinPlanMutation.isPending,
    isLeaving: leavePlanMutation.isPending,
  };
};
