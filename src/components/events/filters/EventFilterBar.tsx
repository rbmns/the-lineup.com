
import React from 'react';
import { EventCategoryFilters } from './EventCategoryFilters';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventFilterBarProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset?: () => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  className?: string;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  allEventTypes,
  selectedEventTypes,
  onToggleEventType,
  onSelectAll,
  onDeselectAll,
  onReset,
  hasActiveFilters,
  onClearAllFilters,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-medium">Filter by category</h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllFilters}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Reset all
          </Button>
        )}
      </div>

      <EventCategoryFilters
        allEventTypes={allEventTypes}
        selectedEventTypes={selectedEventTypes}
        onToggleEventType={onToggleEventType}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onReset={onReset}
      />
    </div>
  );
};
