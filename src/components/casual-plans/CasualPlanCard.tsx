
import React from 'react';
import { CasualPlan } from '@/types/casual-plans';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users } from 'lucide-react';
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

  const currentRsvpStatus = plan.rsvp_status || null;

  return (
    <div 
      className={cn(
        "card-base h-full flex flex-col transition-smooth hover-lift",
        isLoading && "opacity-50",
        className
      )}
      data-plan-id={plan.id}
    >
      <div className="flex-1 space-y-4 p-6">
        {/* Title and Vibe */}
        <div className="space-y-2">
          <h3 className="text-h4 text-graphite-grey line-clamp-2">{plan.title}</h3>
          {showBlurred ? (
            <div className="event-card-tag w-fit">
              ••••••
            </div>
          ) : (
            <Badge variant="secondary" className="event-card-tag bg-sunrise-ochre/20 text-graphite-grey capitalize">
              {plan.vibe}
            </Badge>
          )}
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-small text-graphite-grey/80">
          <CalendarDays className="h-4 w-4 text-ocean-teal flex-shrink-0" />
          <span>
            {formatDate(plan.date)}
            {plan.time && ` • ${formatTime(plan.time)}`}
          </span>
        </div>

        {/* Location */}
        {plan.location && (
          <div className="flex items-center gap-2 text-small text-graphite-grey/80">
            <MapPin className="h-4 w-4 text-ocean-teal flex-shrink-0" />
            <span className="truncate">{plan.location}</span>
          </div>
        )}

        {/* Description */}
        {plan.description && !showBlurred && (
          <p className="text-body-base text-graphite-grey line-clamp-3">
            {plan.description}
          </p>
        )}

        {/* RSVP Buttons */}
        {showRsvpButtons && !showBlurred && (
          <div className="bg-mist-grey p-4 rounded-md">
            <EventRsvpButtons
              currentStatus={currentRsvpStatus}
              onRsvp={handleRsvp}
              isLoading={isLoading}
              size="sm"
              className="w-full"
            />
          </div>
        )}

        {/* Attendee count */}
        {plan.attendee_count && plan.attendee_count > 0 && (
          <div className="flex items-center gap-2 text-small text-graphite-grey/80">
            <Users className="h-4 w-4 text-ocean-teal flex-shrink-0" />
            <span>{plan.attendee_count} attending</span>
          </div>
        )}
      </div>
    </div>
  );
};
