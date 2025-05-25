
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CasualPlan, CreateCasualPlanData } from '@/types/casual-plans';
import { useAuth } from '@/contexts/AuthContext';

export const useCasualPlans = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch casual plans with attendee information - only if authenticated
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['casual-plans'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return []; // Return empty array for non-authenticated users
      }

      console.log('Fetching casual plans...');
      
      const { data: plansData, error: plansError } = await supabase
        .from('casual_plans')
        .select(`
          *,
          creator_profile:creator_id(id, username, avatar_url),
          attendees:casual_plan_attendees(
            id,
            user_id,
            plan_id,
            created_at,
            user_profile:user_id(id, username, avatar_url)
          )
        `)
        .gte('date', new Date().toISOString().split('T')[0]) // Only future plans
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (plansError) {
        console.error('Error fetching plans:', plansError);
        throw plansError;
      }

      console.log('Raw plans data:', plansData);

      // Transform the data to include attendee count and user attendance status
      const transformedPlans: CasualPlan[] = (plansData || []).map(plan => {
        console.log('Processing plan:', plan.id, plan.title);
        
        // Handle creator_profile which might be null or have an error
        let creator_profile: { id: string; username: string; avatar_url?: string[]; } | undefined;
        
        // More explicit type checking for creator data
        const creatorData = plan.creator_profile;
        if (creatorData && 
            typeof creatorData === 'object' && 
            creatorData !== null) {
          
          const typedCreatorData = creatorData as Record<string, unknown>;
          if ('id' in typedCreatorData && 'username' in typedCreatorData) {
            const id = typedCreatorData.id;
            const username = typedCreatorData.username;
            const avatar_url = typedCreatorData.avatar_url;
            
            if (typeof id === 'string' && typeof username === 'string') {
              creator_profile = {
                id,
                username,
                avatar_url: avatar_url as string[] | undefined
              };
            }
          }
        }

        // Handle attendees data transformation
        const attendees = (plan.attendees || []).map(attendee => {
          let user_profile: { id: string; username: string; avatar_url?: string[]; } | undefined;
          
          // More explicit type checking for user data
          const userData = attendee.user_profile;
          if (userData && 
              typeof userData === 'object' && 
              userData !== null) {
            
            const typedUserData = userData as Record<string, unknown>;
            if ('id' in typedUserData && 'username' in typedUserData) {
              const id = typedUserData.id;
              const username = typedUserData.username;
              const avatar_url = typedUserData.avatar_url;
              
              if (typeof id === 'string' && typeof username === 'string') {
                user_profile = {
                  id,
                  username,
                  avatar_url: avatar_url as string[] | undefined
                };
              }
            }
          }

          return {
            id: attendee.id,
            plan_id: attendee.plan_id || plan.id,
            user_id: attendee.user_id,
            created_at: attendee.created_at || new Date().toISOString(),
            user_profile
          };
        });

        const transformedPlan = {
          ...plan,
          creator_profile,
          attendees,
          attendee_count: attendees.length,
          user_attending: user ? attendees.some(att => att.user_id === user.id) : false
        };

        console.log('Transformed plan:', transformedPlan.id, transformedPlan.title);
        return transformedPlan;
      });

      console.log('Final transformed plans:', transformedPlans);
      return transformedPlans;
    },
    enabled: isAuthenticated, // Only run query if authenticated
  });

  // Create a new casual plan
  const createPlanMutation = useMutation({
    mutationFn: async (planData: CreateCasualPlanData) => {
      if (!user) throw new Error('User must be logged in');

      console.log('Creating plan with data:', planData);

      const { data, error } = await supabase
        .from('casual_plans')
        .insert({
          ...planData,
          creator_id: user.id,
        })
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
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
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
