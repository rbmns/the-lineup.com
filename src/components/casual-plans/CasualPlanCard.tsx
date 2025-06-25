
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
        "h-full transition-all duration-200 shadow-sm hover:shadow-md border-gray-200 bg-white rounded-xl",
        isLoading && "opacity-50",
        className
      )}
      data-plan-id={plan.id}
    >
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Title and Vibe */}
          <div className="space-y-2">
            <h3 className="font-semibold text-[#003840] text-lg line-clamp-2">{plan.title}</h3>
            {showBlurred ? (
              <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs w-fit">
                ••••••
              </div>
            ) : (
              <Badge variant="secondary" className="text-xs capitalize bg-[#F4E7D3] text-[#003840] border-none">
                {plan.vibe}
              </Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-[#4A4A48]">
            <CalendarDays className="h-4 w-4 text-[#66B2B2]" />
            {showBlurred ? (
              <span className="text-gray-300">•••• ••</span>
            ) : (
              <span>{formatDate(plan.date)}</span>
            )}
            <Clock className="h-4 w-4 ml-2 text-[#66B2B2]" />
            {showBlurred ? (
              <span className="text-gray-300">••:•• ••</span>
            ) : (
              <span>{formatTime(plan.time)}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-[#4A4A48]">
            <MapPin className="h-4 w-4 text-[#66B2B2]" />
            {showBlurred ? (
              <span className="text-gray-300">••••••••••••••••••••</span>
            ) : (
              <span className="line-clamp-1">{plan.location}</span>
            )}
          </div>

          {/* Description */}
          {plan.description && (
            <p className="text-sm text-[#4A4A48] line-clamp-3">
              {showBlurred ? "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••" : plan.description}
            </p>
          )}

          {/* Attendee Count */}
          <div className="flex items-center gap-2 text-sm text-[#4A4A48]">
            <Users className="h-4 w-4 text-[#66B2B2]" />
            {showBlurred ? (
              <span className="text-gray-300">••• attending</span>
            ) : (
              <>
                <span>{plan.attendee_count || 0} attending</span>
                {plan.max_attendees && (
                  <span className="text-[#4A4A48]/70">
                    (max {plan.max_attendees})
                  </span>
                )}
              </>
            )}
          </div>

          {/* Creator Info */}
          <div className="text-xs text-[#4A4A48]/70">
            {showBlurred ? (
              "Created by ••••••••"
            ) : (
              `Created by ${plan.creator_profile?.username || 'Unknown'}`
            )}
          </div>

          {/* Login message for non-authenticated users */}
          {showBlurred && (
            <div className="mt-4 p-3 bg-[#F4E7D3] border border-[#66B2B2]/20 rounded-lg text-center">
              <p className="text-xs text-[#003840] mb-2">
                Sign in to see full details
              </p>
            </div>
          )}
        </div>

        {/* RSVP Actions - only show for authenticated users */}
        {showRsvpButtons && !showBlurred && (
          <div className="mt-4 pt-4 border-t border-gray-100" data-no-navigation="true">
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
