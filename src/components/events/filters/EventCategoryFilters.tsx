
import React from 'react';
import { CategoryPill } from '@/components/ui/category-pill';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCategoryFiltersProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset: () => void;
  className?: string;
}

export const EventCategoryFilters: React.FC<EventCategoryFiltersProps> = ({
  allEventTypes,
  selectedEventTypes,
  onToggleEventType,
  onSelectAll,
  onDeselectAll,
  onReset,
  className
}) => {
  const allSelected = allEventTypes.length > 0 && allEventTypes.length === selectedEventTypes.length;
  const noneSelected = selectedEventTypes.length === 0;
  const someSelected = selectedEventTypes.length > 0 && !allSelected;
  
  // If no filters are selected (empty array), treat as "all selected" for UX purposes
  const effectiveSelectedTypes = noneSelected ? allEventTypes : selectedEventTypes;
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Event Categories</h3>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-sm h-8 px-3 py-1"
          >
            {allSelected ? (
              <>
                <X className="h-3.5 w-3.5 mr-1.5" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                <span>Select All</span>
              </>
            )}
          </Button>
          
          {someSelected && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="text-sm h-8 px-3 py-1"
            >
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allEventTypes.map((category) => (
          <CategoryPill
            key={category}
            category={category}
            active={effectiveSelectedTypes.includes(category)} 
            onClick={() => onToggleEventType(category)}
            showIcon={true}
            size="default"
          />
        ))}
      </div>
    </div>
  );
};
