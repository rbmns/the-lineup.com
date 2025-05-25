
import React from 'react';
import { CasualPlan } from '@/types/casual-plans';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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

  // Mobile list layout - improved spacing and visual hierarchy
  if (isMobile) {
    return (
      <div className="bg-white rounded-lg border p-4 mb-3 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            {/* Header with vibe and attendee count */}
            <div className="flex items-center justify-between mb-2">
              <CategoryPill 
                category={plan.vibe} 
                size="sm"
                className="capitalize text-xs"
              />
              <div className="flex items-center text-xs text-gray-500">
                <Users className="h-3 w-3 mr-1" />
                <span>{plan.attendee_count || 0}</span>
                {plan.max_attendees && <span>/{plan.max_attendees}</span>}
              </div>
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-base mb-2 line-clamp-2 leading-tight">{plan.title}</h3>
            
            {/* Description if available */}
            {plan.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plan.description}</p>
            )}
            
            {/* Date and time info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>{formattedTime}</span>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{plan.location}</span>
            </div>
            
            {/* Creator info */}
            <div className="flex items-center">
              <Avatar className="h-5 w-5 mr-2">
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
          </div>
          
          {/* Action button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleJoinLeave}
              disabled={isJoining || isLeaving}
              size="sm"
              variant={plan.user_attending ? "outline" : "default"}
              className={`px-4 py-2 ${plan.user_attending ? "text-red-600 border-red-200 hover:bg-red-50" : ""}`}
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
      </div>
    );
  }

  // Desktop card layout (unchanged)
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 h-full flex flex-col">
      {/* Header with vibe tag and attendee count */}
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
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">{plan.title}</h3>
      {plan.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{plan.description}</p>
      )}

      {/* Date, time, and location - compact mobile layout */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span className="truncate">{formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span className="truncate">{formattedTime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span className="truncate">{plan.location}</span>
        </div>
      </div>

      {/* Attendees preview - responsive */}
      {plan.attendees && plan.attendees.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Going:</span>
            <div className="flex -space-x-1.5">
              {plan.attendees.slice(0, 4).map((attendee) => (
                <Avatar key={attendee.id} className="h-5 w-5 border border-white">
                  <AvatarImage 
                    src={attendee.user_profile?.avatar_url?.[0]} 
                    alt={attendee.user_profile?.username}
                  />
                  <AvatarFallback className="text-xs">
                    {attendee.user_profile?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(plan.attendee_count || 0) > 4 && (
                <div className="h-5 w-5 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{(plan.attendee_count || 0) - 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creator info and action button */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Avatar className="h-5 w-5 flex-shrink-0">
            <AvatarImage 
              src={plan.creator_profile?.avatar_url?.[0]} 
              alt={plan.creator_profile?.username}
            />
            <AvatarFallback className="text-xs">
              {plan.creator_profile?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600 truncate">
            by {plan.creator_profile?.username || 'Anonymous'}
          </span>
        </div>

        {/* Join/Leave button */}
        <Button
          onClick={handleJoinLeave}
          disabled={isJoining || isLeaving}
          size="sm"
          variant={plan.user_attending ? "outline" : "default"}
          className={`flex-shrink-0 ml-2 ${plan.user_attending ? "text-red-600 border-red-200 hover:bg-red-50" : ""}`}
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
