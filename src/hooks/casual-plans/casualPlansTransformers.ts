
import { CasualPlan, CasualPlanRsvp } from '@/types/casual-plans';

interface RawPlan {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  vibe: string;
  location: string;
  location_coordinates?: string;
  date: string;
  time: string;
  max_attendees?: number;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  username: string;
  avatar_url?: string[];
}

export const transformCasualPlansData = (
  rawPlans: RawPlan[],
  rawRsvps: CasualPlanRsvp[],
  profiles: Profile[],
  userId?: string
): CasualPlan[] => {
  console.log('Transforming data:', { rawPlans, rawRsvps, profiles, userId });

  // Create lookup maps for efficient data access
  const profileMap = new Map<string, Profile>();
  profiles.forEach(profile => {
    profileMap.set(profile.id, profile);
  });

  const rsvpsByPlan = new Map<string, CasualPlanRsvp[]>();
  rawRsvps.forEach(rsvp => {
    if (!rsvpsByPlan.has(rsvp.plan_id)) {
      rsvpsByPlan.set(rsvp.plan_id, []);
    }
    rsvpsByPlan.get(rsvp.plan_id)!.push(rsvp);
  });

  // Transform plans
  const transformedPlans: CasualPlan[] = rawPlans.map(plan => {
    console.log('Processing plan:', plan.id, plan.title);
    
    // Get creator profile
    const creator_profile = profileMap.get(plan.creator_id);

    // Get RSVPs for this plan
    const planRsvps = rsvpsByPlan.get(plan.id) || [];
    
    // Calculate counts
    const goingCount = planRsvps.filter(rsvp => rsvp.status === 'Going').length;
    const interestedCount = planRsvps.filter(rsvp => rsvp.status === 'Interested').length;
    
    // Get user's RSVP status
    const userRsvp = userId ? planRsvps.find(rsvp => rsvp.user_id === userId) : null;
    const rsvp_status = userRsvp?.status || null;
    
    // For backward compatibility, create attendees from "Going" RSVPs
    const attendees = planRsvps
      .filter(rsvp => rsvp.status === 'Going')
      .map(rsvp => ({
        id: rsvp.id,
        plan_id: rsvp.plan_id,
        user_id: rsvp.user_id,
        created_at: rsvp.created_at,
        user_profile: profileMap.get(rsvp.user_id),
      }));

    const transformedPlan: CasualPlan = {
      ...plan,
      creator_profile,
      attendees,
      attendee_count: goingCount, // Only count "Going" for backward compatibility
      user_attending: rsvp_status === 'Going', // For backward compatibility
      // New RSVP fields
      rsvp_status,
      going_count: goingCount,
      interested_count: interestedCount,
    };

    console.log('Transformed plan:', transformedPlan.id, transformedPlan.title);
    return transformedPlan;
  });

  console.log('Final transformed plans:', transformedPlans);
  return transformedPlans;
};
