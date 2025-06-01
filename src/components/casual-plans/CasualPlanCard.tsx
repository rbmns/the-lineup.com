
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CasualPlan } from '@/types/casual-plans';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

interface CasualPlanCardProps {
  plan: CasualPlan;
  onJoin: (planId: string) => void;
  onLeave: (planId: string) => void;
  onMarkInterested: (planId: string) => void;
  onUnmarkInterested: (planId: string) => void;
  isJoining: boolean;
  isLeaving: boolean;
  isMarkingInterested: boolean;
  isUnmarkingInterested: boolean;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}

export const CasualPlanCard: React.FC<CasualPlanCardProps> = ({
  plan,
  onJoin,
  onLeave,
  onMarkInterested,
  onUnmarkInterested,
  isJoining,
  isLeaving,
  isMarkingInterested,
  isUnmarkingInterested,
  isAuthenticated,
  onLoginPrompt,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleJoinLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleInterested = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }

    if (plan.user_interested) {
      onUnmarkInterested(plan.id);
    } else {
      onMarkInterested(plan.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/casual-plans/${plan.id}`);
  };

  const formattedDate = formatFeaturedDate(plan.date);
  const formattedTime = formatTime(plan.time);

  const attendeeCount = plan.attendee_count || 0;
  const maxAttendees = plan.max_attendees;
  const isFull = maxAttendees && attendeeCount >= maxAttendees;
  const fillPercentage = maxAttendees ? Math.round((attendeeCount / maxAttendees) * 100) : 67;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm cursor-pointer"
      onClick={handleCardClick}
    >
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
              <span className="bg-gray-300 text-transparent rounded">Sports</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
            <Users className="h-3 w-3 mr-1" />
            {isAuthenticated ? (
              <>
                <span className="font-medium">{attendeeCount}</span>
                {maxAttendees && <span className="text-gray-400">/{maxAttendees}</span>}
              </>
            ) : (
              <span className="font-medium text-gray-300">8/12</span>
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
            <span className="bg-gray-300 text-transparent rounded truncate">Zandvoort Beach, North Section</span>
          )}
        </div>
        
        {/* Description if available and authenticated */}
        {isAuthenticated && plan.description && (
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
                  <span className="text-sm bg-gray-300 text-transparent rounded truncate">Christi</span>
                  <div className="text-xs text-gray-300">Organizer</div>
                </div>
              </>
            )}
          </div>
          
          {/* Action button */}
          {isAuthenticated ? (
            <div className="flex gap-1 flex-shrink-0 ml-3">
              <Button
                onClick={handleJoinLeave}
                disabled={isJoining || isLeaving || (isFull && !plan.user_attending)}
                size="sm"
                className={`h-8 px-3 text-xs font-medium ${
                  plan.user_attending 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                variant={plan.user_attending ? "default" : "outline"}
              >
                {isJoining || isLeaving ? (
                  "..."
                ) : plan.user_attending ? (
                  <>
                    <div className="w-2 h-2 mr-1 bg-white rounded-full"></div>
                    Going
                  </>
                ) : isFull ? (
                  "Full"
                ) : (
                  "Going"
                )}
              </Button>
              
              <Button
                onClick={handleInterested}
                size="sm"
                variant={plan.user_interested ? "default" : "outline"}
                className={`h-8 px-3 text-xs font-medium ${
                  plan.user_interested 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={isMarkingInterested || isUnmarkingInterested}
              >
                {isMarkingInterested || isUnmarkingInterested ? (
                  "..."
                ) : plan.user_interested ? (
                  <>
                    <div className="w-2 h-2 mr-1 bg-white rounded-full"></div>
                    Interested
                  </>
                ) : (
                  "Interested"
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLoginPrompt();
              }}
              size="sm"
              variant="outline"
              className="flex-shrink-0 ml-3 h-8 px-4 text-xs font-medium text-gray-400 border-gray-200"
            >
              Sign in to RSVP
            </Button>
          )}
        </div>
        
        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                Sign in
              </Link> to see location and organizer details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
