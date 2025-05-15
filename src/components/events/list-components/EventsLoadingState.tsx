
import React from 'react';
import { Loader2 } from 'lucide-react';

interface EventsLoadingStateProps {
  message?: string;
}

export const EventsLoadingState: React.FC<EventsLoadingStateProps> = ({ 
  message = 'Loading events...' 
}) => {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-purple" />
      <span className="ml-2 text-gray-500">{message}</span>
    </div>
  );
};
