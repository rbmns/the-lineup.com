
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CasualPlan } from '@/types/casual-plans';

export const useFriendsCasualPlans = (friendIds: string[], currentUserId?: string) => {
  const { data: friendsCasualPlans = [], isLoading, error } = useQuery({
    queryKey: ['friends-casual-plans', friendIds, currentUserId],
    queryFn: async () => {
      if (!friendIds.length || !currentUserId) {
        return [];
      }

      try {
        // Get casual plans created by friends
        const { data: friendCreatedPlans, error: createdError } = await supabase
          .from('casual_plans')
          .select(`
            *,
            creator_profile:profiles!casual_plans_creator_id_fkey (
              id, username, avatar_url
            ),
            attendees:casual_plan_attendees (
              id, user_id,
              user_profile:profiles!casual_plan_attendees_user_id_fkey (
                id, username, avatar_url
              )
            )
          `)
          .in('creator_id', friendIds)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (createdError) {
          console.error('Error fetching friend created plans:', createdError);
        }

        // Get casual plans that friends are attending
        const { data: friendAttendingPlans, error: attendingError } = await supabase
          .from('casual_plan_attendees')
          .select(`
            casual_plans (
              *,
              creator_profile:profiles!casual_plans_creator_id_fkey (
                id, username, avatar_url
              ),
              attendees:casual_plan_attendees (
                id, user_id,
                user_profile:profiles!casual_plan_attendees_user_id_fkey (
                  id, username, avatar_url
                )
              )
            )
          `)
          .in('user_id', friendIds);

        if (attendingError) {
          console.error('Error fetching friend attending plans:', attendingError);
        }

        // Process created plans
        const createdPlans: CasualPlan[] = friendCreatedPlans?.map(plan => ({
          ...plan,
          creator_profile: plan.creator_profile,
          attendees: plan.attendees || [],
          attendee_count: plan.attendees?.length || 0,
          user_attending: plan.attendees?.some((a: any) => a.user_id === currentUserId) || false,
          is_friend_creator: true
        })) || [];

        // Process attending plans
        const attendingPlans: CasualPlan[] = friendAttendingPlans
          ?.filter(item => item.casual_plans)
          .map(item => {
            const plan = item.casual_plans as any;
            return {
              ...plan,
              creator_profile: plan.creator_profile,
              attendees: plan.attendees || [],
              attendee_count: plan.attendees?.length || 0,
              user_attending: plan.attendees?.some((a: any) => a.user_id === currentUserId) || false,
              friend_attending: true
            };
          }) || [];

        // Combine and deduplicate plans
        const allPlans = [...createdPlans, ...attendingPlans];
        const uniquePlans = allPlans.filter((plan, index, self) => 
          index === self.findIndex(p => p.id === plan.id)
        );

        // Sort by date
        return uniquePlans.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

      } catch (error) {
        console.error('Error fetching friends casual plans:', error);
        return [];
      }
    },
    enabled: friendIds.length > 0 && !!currentUserId,
  });

  return {
    friendsCasualPlans,
    isLoading,
    error
  };
};
