
import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { CategoryPill } from '@/components/ui/category-pill';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';

interface CasualPlan {
  id: string;
  title: string;
  vibe: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  attendee_count?: number;
}

interface CasualPlanPreviewCardProps {
  plan: CasualPlan;
  isAuthenticated: boolean;
  onClick: (planId: string) => void;
}

export const CasualPlanPreviewCard: React.FC<CasualPlanPreviewCardProps> = ({
  plan,
  isAuthenticated,
  onClick
}) => {
  return (
    <div 
      className="border border-gray-200 rounded-lg p-3 md:p-4 cursor-pointer hover:border-gray-300 transition-colors"
      onClick={() => onClick(plan.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isAuthenticated ? (
            <CategoryPill 
              category={plan.vibe} 
              size="sm"
              className="capitalize text-xs px-2 py-1 flex-shrink-0"
            />
          ) : (
            <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs flex-shrink-0">
              ••••••
            </div>
          )}
          <h4 className="font-medium text-gray-900 text-sm truncate">{plan.title}</h4>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
          {formatFeaturedDate(plan.date)}
        </span>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500 mb-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatTime(plan.time)}</span>
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          {isAuthenticated ? (
            <span className="truncate">{plan.location}</span>
          ) : (
            <span className="text-gray-300">••••••••••••••••</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {isAuthenticated ? (
            <span>{plan.attendee_count || 0} interested</span>
          ) : (
            <span className="text-gray-300">••• interested</span>
          )}
        </div>
      </div>
      
      {isAuthenticated && plan.description && (
        <p className="text-sm text-gray-600 line-clamp-1">{plan.description}</p>
      )}
    </div>
  );
};
