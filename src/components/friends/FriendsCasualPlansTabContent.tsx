
import React, { useState, useMemo } from 'react';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFriendsCasualPlans } from '@/hooks/useFriendsCasualPlans';
import { FriendCasualPlanCard } from './FriendCasualPlanCard';

interface FriendsCasualPlansTabContentProps {
  friendIds: string[];
  currentUserId?: string;
}

export const FriendsCasualPlansTabContent: React.FC<FriendsCasualPlansTabContentProps> = ({ 
  friendIds, 
  currentUserId 
}) => {
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past'>('upcoming');

  const { friendsCasualPlans, isLoading } = useFriendsCasualPlans(friendIds, currentUserId);

  const { upcomingPlans, pastPlans } = useMemo(() => {
    const now = new Date();
    const upcoming = friendsCasualPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= now;
    });
    const past = friendsCasualPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate < now;
    });
    return { upcomingPlans: upcoming, pastPlans: past };
  }, [friendsCasualPlans]);

  const currentPlans = timeFilter === 'upcoming' ? upcomingPlans : pastPlans;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Friends' Casual Plans</h2>
        <span className="text-sm text-gray-500">{upcomingPlans.length} upcoming</span>
      </div>
      
      <div className="flex gap-3 mb-6">
        <Button
          variant={timeFilter === 'upcoming' ? 'default' : 'ghost'}
          onClick={() => setTimeFilter('upcoming')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Upcoming
          {upcomingPlans.length > 0 && (
            <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
              {upcomingPlans.length}
            </span>
          )}
        </Button>
        <Button
          variant={timeFilter === 'past' ? 'default' : 'ghost'}
          onClick={() => setTimeFilter('past')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Past
          {pastPlans.length > 0 && (
            <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
              {pastPlans.length}
            </span>
          )}
        </Button>
      </div>

      {currentPlans.length > 0 ? (
        <div className="space-y-4">
          {currentPlans.map((plan) => (
            <FriendCasualPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {timeFilter} casual plans
          </h3>
          <p className="text-gray-600 mb-4">
            {timeFilter === 'upcoming' 
              ? "Your friends haven't created any upcoming casual plans yet"
              : "No past casual plans from your friends"
            }
          </p>
          {timeFilter === 'upcoming' && (
            <Button variant="outline">
              Discover Plans
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};
