
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface EventDetailHeaderProps {
  onBackToEvents: () => void;
  isMobile: boolean;
}

export const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({
  onBackToEvents,
  isMobile,
}) => {
  return (
    <div className="mb-4">
      <Button 
        variant="outline" 
        onClick={onBackToEvents}
        size={isMobile ? "default" : "lg"}
        className="flex items-center gap-1.5 text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Events
      </Button>
    </div>
  );
};
