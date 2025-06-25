
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CasualPlan } from '@/types/casual-plans';
import { useAuth } from '@/contexts/AuthContext';

export const useCasualPlansQuery = () => {
  const { user } = useAuth();

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['casual-plans', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casual_plans')
        .select(`
          *,
          creator_profile:profiles!casual_plans_creator_id_fkey (
            id, username, avatar_url
          ),
          rsvps:casual_plan_rsvps (
            id, user_id, status
          )
        `)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      return data?.map((plan: any) => ({
        ...plan,
        attendee_count: plan.rsvps?.filter((r: any) => r.status === 'Going').length || 0,
        user_rsvp_status: user ? plan.rsvps?.find((r: any) => r.user_id === user.id)?.status || null : null
      })) as CasualPlan[];
    },
    enabled: true,
  });

  return {
    plans,
    isLoading,
    error
  };
};
