
import React from 'react';
import { CasualPlan } from '@/types/casual-plans';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';

interface CasualPlanCardProps {
  plan: CasualPlan;
  onJoin: (planId: string) => void;
  onLeave: (planId: string) => void;
  isJoining: boolean;
  isLeaving: boolean;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}

export const CasualPlanCard: React.FC<CasualPlanCardProps> = ({
  plan,
  onJoin,
  onLeave,
  isJoining,
  isLeaving,
  isAuthenticated,
  onLoginPrompt,
}) => {
  const handleJoinLeave = () => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }

    if (plan.user_attending) {
      onLeave(plan.id);
    } else {
      onJoin(plan.id);
    }
  };

  const formattedDate = formatFeaturedDate(plan.date);
  const formattedTime = formatTime(plan.time);

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
      {/* Header with vibe tag */}
      <div className="flex items-center justify-between mb-3">
        <CategoryPill 
          category={plan.vibe} 
          size="sm"
          className="capitalize"
        />
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{plan.attendee_count || 0}</span>
          {plan.max_attendees && (
            <span>/{plan.max_attendees}</span>
          )}
        </div>
      </div>

      {/* Title and description */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{plan.title}</h3>
      {plan.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.description}</p>
      )}

      {/* Date, time, and location */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">{plan.location}</span>
        </div>
      </div>

      {/* Attendees preview */}
      {plan.attendees && plan.attendees.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Going:</span>
            <div className="flex -space-x-2">
              {plan.attendees.slice(0, 3).map((attendee) => (
                <Avatar key={attendee.id} className="h-6 w-6 border-2 border-white">
                  <AvatarImage 
                    src={attendee.user_profile?.avatar_url?.[0]} 
                    alt={attendee.user_profile?.username}
                  />
                  <AvatarFallback className="text-xs">
                    {attendee.user_profile?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(plan.attendee_count || 0) > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{(plan.attendee_count || 0) - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creator info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={plan.creator_profile?.avatar_url?.[0]} 
              alt={plan.creator_profile?.username}
            />
            <AvatarFallback className="text-xs">
              {plan.creator_profile?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            by {plan.creator_profile?.username || 'Anonymous'}
          </span>
        </div>

        {/* Join/Leave button */}
        <Button
          onClick={handleJoinLeave}
          disabled={isJoining || isLeaving}
          size="sm"
          variant={plan.user_attending ? "outline" : "default"}
          className={plan.user_attending ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
        >
          {isJoining || isLeaving 
            ? "..." 
            : plan.user_attending 
              ? "Leave" 
              : "Join"
          }
        </Button>
      </div>
    </div>
  );
};
