
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

  const currentRsvpStatus = plan.rsvp_status || null;

  return (
    <Card 
      className={cn(
        "h-full transition-all duration-200 shadow-sm hover:shadow-md border-overcast bg-coconut rounded-xl",
        isLoading && "opacity-50",
        className
      )}
      data-plan-id={plan.id}
    >
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Title and Vibe */}
          <div className="space-y-2">
            <h3 className="font-display text-midnight text-lg line-clamp-2">{plan.title}</h3>
            {showBlurred ? (
              <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs w-fit">
                ••••••
              </div>
            ) : (
              <Badge variant="secondary" className="bg-seafoam text-midnight text-xs rounded-full capitalize">
                {plan.vibe}
              </Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 font-mono text-overcast text-xs">
            <CalendarDays className="h-4 w-4 text-clay flex-shrink-0" />
            <span>
              {formatDate(plan.date)}
              {plan.time && ` • ${formatTime(plan.time)}`}
            </span>
          </div>

          {/* Location */}
          {plan.location && (
            <div className="flex items-center gap-2 font-mono text-overcast text-xs">
              <MapPin className="h-4 w-4 text-clay flex-shrink-0" />
              <span className="truncate">{plan.location}</span>
            </div>
          )}

          {/* Description */}
          {plan.description && !showBlurred && (
            <p className="text-midnight text-sm line-clamp-3">
              {plan.description}
            </p>
          )}

          {/* RSVP Buttons */}
          {showRsvpButtons && !showBlurred && (
            <div className="bg-sage text-midnight p-4 rounded-md">
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
            <div className="flex items-center gap-2 font-mono text-overcast text-xs">
              <Users className="h-4 w-4 text-clay flex-shrink-0" />
              <span>{plan.attendee_count} attending</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
