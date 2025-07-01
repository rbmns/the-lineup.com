
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EventFormActionsProps {
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export const EventFormActions: React.FC<EventFormActionsProps> = ({
  isSubmitting,
  isEditMode = false
}) => {
  return (
    <div className="flex justify-end pt-6">
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="min-w-[140px]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'Updating...' : 'Publishing...'}
          </>
        ) : (
          isEditMode ? 'Update Event' : 'Publish Event'
        )}
      </Button>
    </div>
  );
};
