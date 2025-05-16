
import React from 'react';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NoResultsFoundProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
  showFiltersHint?: boolean;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({
  message,
  actionText,
  onAction,
  showFiltersHint = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
        <CalendarX className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
      
      {showFiltersHint && (
        <p className="text-gray-500 mb-4">
          Try adjusting your filters to see more events.
        </p>
      )}
      
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
}
