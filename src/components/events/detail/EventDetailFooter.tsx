
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface EventDetailFooterProps {
  onBackToEvents: () => void;
  isMobile: boolean;
}

export const EventDetailFooter: React.FC<EventDetailFooterProps> = ({
  onBackToEvents,
  isMobile,
}) => {
  return (
    <div className="mt-8 mb-4 flex justify-center">
      <Button 
        variant="outline" 
        onClick={onBackToEvents}
        className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
        size={isMobile ? "default" : "lg"}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Events</span>
      </Button>
    </div>
  );
};
