
import React from 'react';
import { CasualPlan } from '@/types/casual-plans';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Users } from 'lucide-react';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { cn } from '@/lib/utils';

interface CasualPlanCardProps {
  plan: CasualPlan;
  onRsvp?: (planId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  showRsvpButtons?: boolean;
  isLoading?: boolean;
  className?: string;
  showBlurred?: boolean;
}

export const CasualPlanCard: React.FC<CasualPlanCardProps> = ({
  plan,
  onRsvp,
  showRsvpButtons = false,
  isLoading = false,
  className,
  showBlurred = false
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (onRsvp) {
      return await onRsvp(plan.id, status);
    }
    return false;
  };

  // Use the correct property name from CasualPlan type
  const currentRsvpStatus = plan.rsvp_status || null;

  return (
    <Card 
      className={cn(
        "h-full transition-all duration-200",
        isLoading && "opacity-50",
        className
      )}
      data-plan-id={plan.id}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Title and Vibe */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{plan.title}</h3>
            {showBlurred ? (
              <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs w-fit">
                ••••••
              </div>
            ) : (
              <Badge variant="secondary" className="text-xs capitalize">
                {plan.vibe}
              </Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4" />
            {showBlurred ? (
              <span className="text-gray-300">•••• ••</span>
            ) : (
              <span>{formatDate(plan.date)}</span>
            )}
            <Clock className="h-4 w-4 ml-2" />
            {showBlurred ? (
              <span className="text-gray-300">••:•• ••</span>
            ) : (
              <span>{formatTime(plan.time)}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {showBlurred ? (
              <span className="text-gray-300">••••••••••••••••••••</span>
            ) : (
              <span className="line-clamp-1">{plan.location}</span>
            )}
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {showBlurred ? "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••" : plan.description}
            </p>
          )}

          {/* Attendee Count */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            {showBlurred ? (
              <span className="text-gray-300">••• attending</span>
            ) : (
              <>
                <span>{plan.attendee_count || 0} attending</span>
                {plan.max_attendees && (
                  <span className="text-gray-400">
                    (max {plan.max_attendees})
                  </span>
                )}
              </>
            )}
          </div>

          {/* Creator Info */}
          <div className="text-xs text-gray-500">
            {showBlurred ? (
              "Created by ••••••••"
            ) : (
              `Created by ${plan.creator_profile?.username || 'Unknown'}`
            )}
          </div>

          {/* Login message for non-authenticated users */}
          {showBlurred && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-xs text-blue-700 mb-2">
                Sign in to see full details
              </p>
            </div>
          )}
        </div>

        {/* RSVP Actions - only show for authenticated users */}
        {showRsvpButtons && !showBlurred && (
          <div className="mt-4 pt-4 border-t" data-no-navigation="true">
            <EventRsvpButtons
              currentStatus={currentRsvpStatus}
              onRsvp={handleRsvp}
              isLoading={isLoading}
              size="sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
