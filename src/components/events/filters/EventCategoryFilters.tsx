
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pills';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  // Note: We now treat empty selection as intended behavior
  const noneSelected = selectedEventTypes.length === 0;
  
  // Handle the "All" pill click
  const handleAllClick = () => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };
  
  // Show reset option only when some filters are selected but not all or none
  const showResetOption = selectedEventTypes.length > 0 && !allSelected && !noneSelected;
  
  return (
    <div className={cn("relative min-h-[44px]", className)}>
      <div className="flex items-center space-x-2 overflow-x-auto">
        <AllCategoryPill
          active={allSelected}
          onClick={handleAllClick}
          size="default"
        />

        {/* Show the category pills */}
        {allEventTypes.map((category) => (
          <CategoryPill
            key={category}
            category={category}
            active={selectedEventTypes.includes(category)} 
            onClick={() => onToggleEventType(category)}
            showIcon={false}
            size="default"
          />
        ))}
        
        {/* Reset button that doesn't affect layout */}
        {showResetOption && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 ml-2 h-9"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset to all</span>
          </Button>
        )}
      </div>
    </div>
  );
};
