
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface EventFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const EventFormActions: React.FC<EventFormActionsProps> = ({
  isSubmitting,
  isEditMode
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "pt-6 border-t border-mist-grey sticky bottom-0 bg-white",
      isMobile ? "pb-6 -mx-2 px-4" : "pb-4"
    )}>
      <Button 
        type="submit" 
        variant="default"
        disabled={isSubmitting} 
        className="w-full h-12 text-base font-semibold bg-ocean-teal hover:bg-ocean-teal/90"
      >
        {isSubmitting ? "Publishing..." : isEditMode ? "Update Event" : "Publish Event"}
      </Button>
    </div>
  );
};
