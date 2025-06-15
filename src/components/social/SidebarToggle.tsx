
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarToggleProps {
  visible: boolean;
  onToggle?: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ visible, onToggle }) => {
  if (!visible) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="bg-white shadow-lg border border-gray-200 hover:bg-sand rounded-l-lg rounded-r-none px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="bg-white shadow-lg border border-gray-200 hover:bg-sand rounded-l-lg rounded-r-none px-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
