
import React from 'react';
import { Filter } from 'lucide-react';
import { EventCategoryFilters } from './EventCategoryFilters';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  // DropdownMenuItem, // Not used, can be removed if not needed elsewhere
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
// Removed DateRange as it's not used in this component's props or logic
// import { DateRange } from 'react-day-picker'; 
import { CategoryPill } from '@/components/ui/category-pill'; // Added this import

interface EventFilterBarProps {
  allEventTypes: string[];
  selectedEventTypes: string[];
  onToggleEventType: (type: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onReset: () => void;
  hasActiveFilters?: boolean;
  onClearAllFilters?: () => void;
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
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <EventCategoryFilters
          allEventTypes={allEventTypes}
          selectedEventTypes={selectedEventTypes}
          onToggleEventType={onToggleEventType}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onReset={onReset}
        />
      </div>
      
      {/* Mobile View with Dropdown */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Event Categories</h3>
          
          <DropdownMenu 
            open={showMobileFilters} 
            onOpenChange={setShowMobileFilters}
          >
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {selectedEventTypes.length > 0 && selectedEventTypes.length < allEventTypes.length && (
                  <span className="bg-primary text-white rounded-full px-1.5 py-0.5 text-xs">
                    {selectedEventTypes.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] p-4">
              <EventCategoryFilters
                allEventTypes={allEventTypes}
                selectedEventTypes={selectedEventTypes}
                onToggleEventType={(type) => {
                  onToggleEventType(type);
                  // Consider closing dropdown after selection if desired for UX
                  // setShowMobileFilters(false); 
                }}
                onSelectAll={() => {
                  onSelectAll();
                  // setShowMobileFilters(false); // Optional: close dropdown
                }}
                onDeselectAll={() => {
                  onDeselectAll();
                  // setShowMobileFilters(false); // Optional: close dropdown
                }}
                onReset={() => {
                  onReset();
                  // setShowMobileFilters(false); // Optional: close dropdown
                }}
              />
              
              {hasActiveFilters && onClearAllFilters && ( // Ensure onClearAllFilters is defined
                <>
                  <DropdownMenuSeparator className="my-2" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (onClearAllFilters) onClearAllFilters();
                      setShowMobileFilters(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Show selected filters in a scrollable row on mobile */}
        {selectedEventTypes.length > 0 && selectedEventTypes.length < allEventTypes.length && (
          <div className="flex overflow-x-auto gap-2 pt-3 pb-1 -mx-2 px-2 snap-x scrollbar-hide">
            {selectedEventTypes.map(category => (
              <div 
                key={category} 
                className="snap-start flex-shrink-0"
              >
                <CategoryPill 
                  key={category} // Inner key is fine, outer div already has a key
                  category={category}
                  active={true} // These are selected, so always active in this context
                  onClick={() => onToggleEventType(category)}
                  showIcon={true}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
