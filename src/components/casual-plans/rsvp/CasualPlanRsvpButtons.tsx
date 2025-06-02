
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CasualPlanRsvpStatus } from '@/hooks/casual-plans/useCasualPlanRsvpHandler';

interface CasualPlanRsvpButtonsProps {
  planId: string;
  currentStatus?: CasualPlanRsvpStatus;
  goingCount?: number;
  interestedCount?: number;
  onRsvp: (planId: string, status: CasualPlanRsvpStatus) => Promise<boolean>;
  isLoading?: boolean;
  className?: string;
  compact?: boolean;
}

export const CasualPlanRsvpButtons: React.FC<CasualPlanRsvpButtonsProps> = ({
  planId,
  currentStatus,
  goingCount = 0,
  interestedCount = 0,
  onRsvp,
  isLoading = false,
  className,
  compact = false
}) => {
  const handleGoingClick = () => {
    onRsvp(planId, 'Going');
  };

  const handleInterestedClick = () => {
    onRsvp(planId, 'Interested');
  };

  if (compact) {
    return (
      <div className={cn("flex gap-2", className)}>
        <Button
          onClick={handleGoingClick}
          disabled={isLoading}
          size="sm"
          variant={currentStatus === 'Going' ? 'default' : 'outline'}
          className={cn(
            "flex-1",
            currentStatus === 'Going' 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "text-green-600 border-green-200 hover:bg-green-50"
          )}
        >
          <Users className="h-3 w-3 mr-1" />
          {isLoading ? '...' : currentStatus === 'Going' ? 'Going' : 'Join'}
        </Button>
        <Button
          onClick={handleInterestedClick}
          disabled={isLoading}
          size="sm"
          variant={currentStatus === 'Interested' ? 'default' : 'outline'}
          className={cn(
            "flex-1",
            currentStatus === 'Interested' 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "text-blue-600 border-blue-200 hover:bg-blue-50"
          )}
        >
          <Heart className="h-3 w-3 mr-1" />
          {isLoading ? '...' : currentStatus === 'Interested' ? 'Interested' : 'Interested'}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3", className)}>
      <Button
        onClick={handleGoingClick}
        disabled={isLoading}
        variant={currentStatus === 'Going' ? 'default' : 'outline'}
        className={cn(
          "flex items-center gap-2",
          currentStatus === 'Going' 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "text-green-600 border-green-200 hover:bg-green-50"
        )}
      >
        <Users className="h-4 w-4" />
        <span>{currentStatus === 'Going' ? 'Going' : 'Join'}</span>
        {goingCount > 0 && (
          <span className="bg-white/20 px-2 py-1 rounded text-xs">
            {goingCount}
          </span>
        )}
      </Button>

      <Button
        onClick={handleInterestedClick}
        disabled={isLoading}
        variant={currentStatus === 'Interested' ? 'default' : 'outline'}
        className={cn(
          "flex items-center gap-2",
          currentStatus === 'Interested' 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "text-blue-600 border-blue-200 hover:bg-blue-50"
        )}
      >
        <Heart className="h-4 w-4" />
        <span>Interested</span>
        {interestedCount > 0 && (
          <span className="bg-white/20 px-2 py-1 rounded text-xs">
            {interestedCount}
          </span>
        )}
      </Button>
    </div>
  );
};
