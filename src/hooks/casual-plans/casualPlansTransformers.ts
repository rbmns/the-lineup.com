
import { CasualPlan } from '@/types/casual-plans';

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

interface RawAttendee {
  id: string;
  plan_id: string;
  user_id: string;
  created_at: string;
}

interface RawInterest {
  id: string;
  plan_id: string;
  user_id: string;
  created_at: string;
}

interface Profile {
  id: string;
  username: string;
  avatar_url?: string[];
}

export const transformCasualPlansData = (
  rawPlans: RawPlan[],
  rawAttendees: RawAttendee[],
  profiles: Profile[],
  userId?: string,
  rawInterests: RawInterest[] = []
): CasualPlan[] => {
  console.log('Transforming data:', { rawPlans, rawAttendees, profiles, userId, rawInterests });

  // Create lookup maps for efficient data access
  const profileMap = new Map<string, Profile>();
  profiles.forEach(profile => {
    profileMap.set(profile.id, profile);
  });

  const attendeesByPlan = new Map<string, RawAttendee[]>();
  rawAttendees.forEach(attendee => {
    if (!attendeesByPlan.has(attendee.plan_id)) {
      attendeesByPlan.set(attendee.plan_id, []);
    }
    attendeesByPlan.get(attendee.plan_id)!.push(attendee);
  });

  const interestsByPlan = new Map<string, RawInterest[]>();
  rawInterests.forEach(interest => {
    if (!interestsByPlan.has(interest.plan_id)) {
      interestsByPlan.set(interest.plan_id, []);
    }
    interestsByPlan.get(interest.plan_id)!.push(interest);
  });

  // Transform plans
  const transformedPlans: CasualPlan[] = rawPlans.map(plan => {
    console.log('Processing plan:', plan.id, plan.title);
    
    // Get creator profile
    const creator_profile = profileMap.get(plan.creator_id);

    // Get attendees for this plan
    const planAttendees = attendeesByPlan.get(plan.id) || [];
    
    // Get interests for this plan
    const planInterests = interestsByPlan.get(plan.id) || [];

    const transformedPlan: CasualPlan = {
      ...plan,
      creator_profile,
      attendee_count: planAttendees.length,
      interested_count: planInterests.length,
      user_attending: userId ? planAttendees.some(att => att.user_id === userId) : false,
      user_interested: userId ? planInterests.some(int => int.user_id === userId) : false,
    };

    console.log('Transformed plan:', transformedPlan.id, transformedPlan.title);
    return transformedPlan;
  });

  console.log('Final transformed plans:', transformedPlans);
  return transformedPlans;
};
