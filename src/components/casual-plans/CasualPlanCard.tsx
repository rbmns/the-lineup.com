
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

  // Enhanced card design based on the reference image
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      <div className="p-4">
        {/* Header with vibe pill and attendee count */}
        <div className="flex items-center justify-between mb-3">
          <CategoryPill 
            category={plan.vibe} 
            size="sm"
            className="capitalize text-xs px-2 py-1"
          />
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
            <Users className="h-3 w-3 mr-1" />
            <span className="font-medium">{plan.attendee_count || 0}</span>
            {plan.max_attendees && <span className="text-gray-400">/{plan.max_attendees}</span>}
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
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{plan.location}</span>
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
            <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
              <AvatarImage 
                src={plan.creator_profile?.avatar_url?.[0]} 
                alt={plan.creator_profile?.username}
              />
              <AvatarFallback className="text-xs bg-gray-100">
                {plan.creator_profile?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 truncate">
              {plan.creator_profile?.username || 'Anonymous'}
            </span>
          </div>
          
          {/* Action button - matches reference design */}
          <Button
            onClick={handleJoinLeave}
            disabled={isJoining || isLeaving}
            size="sm"
            variant={plan.user_attending ? "outline" : "default"}
            className={`
              flex-shrink-0 ml-3 h-8 px-4 text-xs font-medium
              ${plan.user_attending 
                ? "text-blue-600 border-blue-200 hover:bg-blue-50 bg-blue-50" 
                : "bg-green-600 hover:bg-green-700 text-white border-0"
              }
            `}
          >
            {isJoining || isLeaving 
              ? "..." 
              : plan.user_attending 
                ? "Going" 
                : "Interested"
            }
          </Button>
        </div>
      </div>
    </div>
  );
};
