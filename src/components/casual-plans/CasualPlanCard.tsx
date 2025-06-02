
import React from 'react';
import { CasualPlan } from '@/types/casual-plans';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Users, Calendar, Heart } from 'lucide-react';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { CasualPlanRsvpButtons } from './rsvp/CasualPlanRsvpButtons';

interface CasualPlanCardProps {
  plan: CasualPlan;
  onJoin: (planId: string) => void;
  onLeave: (planId: string) => void;
  onRsvp?: (planId: string, status: 'Going' | 'Interested' | null) => Promise<boolean>;
  isJoining: boolean;
  isLeaving: boolean;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
  loadingPlanId?: string | null;
}

export const CasualPlanCard: React.FC<CasualPlanCardProps> = ({
  plan,
  onJoin,
  onLeave,
  onRsvp,
  isJoining,
  isLeaving,
  isAuthenticated,
  onLoginPrompt,
  loadingPlanId,
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

  const handleRsvp = async (planId: string, status: 'Going' | 'Interested' | null) => {
    if (!isAuthenticated) {
      onLoginPrompt();
      return false;
    }

    if (onRsvp) {
      return await onRsvp(planId, status);
    }
    
    // Fallback to old system
    if (status === 'Going') {
      onJoin(planId);
    } else if (status === null && plan.user_attending) {
      onLeave(planId);
    }
    
    return true;
  };

  const formattedDate = formatFeaturedDate(plan.date);
  const formattedTime = formatTime(plan.time);
  const isLoadingThisPlan = loadingPlanId === plan.id;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      <div className="p-4">
        {/* Header with vibe pill and attendee count */}
        <div className="flex items-center justify-between mb-3">
          {isAuthenticated ? (
            <CategoryPill 
              category={plan.vibe} 
              size="sm"
              className="capitalize text-xs px-2 py-1"
            />
          ) : (
            <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs">
              ••••••
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {/* Going count */}
            <div className="flex items-center bg-green-50 px-2 py-1 rounded">
              <Users className="h-3 w-3 mr-1 text-green-600" />
              {isAuthenticated ? (
                <>
                  <span className="font-medium text-green-700">{plan.going_count || 0}</span>
                  {plan.max_attendees && <span className="text-green-500">/{plan.max_attendees}</span>}
                </>
              ) : (
                <span className="font-medium text-gray-300">•/••</span>
              )}
            </div>
            
            {/* Interested count */}
            {(plan.interested_count || 0) > 0 && (
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                <Heart className="h-3 w-3 mr-1 text-blue-600" />
                <span className="font-medium text-blue-700">{plan.interested_count}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 leading-tight text-gray-900">
          {plan.title}
        </h3>
        
        {/* Date and time - single line */}
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          <span>{formattedDate}</span>
          <span className="mx-2 text-gray-400">•</span>
          <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          <span>{formattedTime}</span>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-sm mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
          {isAuthenticated ? (
            <span className="text-gray-600 truncate">{plan.location}</span>
          ) : (
            <span className="text-gray-300 truncate">••••••••••••••••••••••••••</span>
          )}
        </div>
        
        {/* Description if available */}
        {plan.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {plan.description}
          </p>
        )}
        
        {/* Footer with creator and action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center min-w-0 flex-1">
            {isAuthenticated ? (
              <>
                <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
                  <AvatarImage 
                    src={plan.creator_profile?.avatar_url?.[0]} 
                    alt={plan.creator_profile?.username}
                  />
                  <AvatarFallback className="text-xs bg-gray-100">
                    {plan.creator_profile?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm text-gray-600 truncate">
                    {plan.creator_profile?.username || 'Anonymous'}
                  </span>
                  <div className="text-xs text-gray-400">Organizer</div>
                </div>
              </>
            ) : (
              <>
                <div className="h-6 w-6 mr-2 flex-shrink-0 bg-gray-200 rounded-full"></div>
                <div>
                  <span className="text-sm text-gray-300 truncate">••••••</span>
                  <div className="text-xs text-gray-300">Organizer</div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* RSVP Buttons */}
        {isAuthenticated ? (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <CasualPlanRsvpButtons
              planId={plan.id}
              currentStatus={plan.rsvp_status}
              goingCount={plan.going_count}
              interestedCount={plan.interested_count}
              onRsvp={handleRsvp}
              isLoading={isLoadingThisPlan}
              compact
            />
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                Sign in
              </Link> to RSVP and see organizer details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
