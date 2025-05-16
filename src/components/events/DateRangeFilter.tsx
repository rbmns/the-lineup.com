
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onReset: () => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
  onReset,
  selectedDateFilter,
  onDateFilterChange,
}) => {
  const isMobile = useIsMobile();
  
  // Quick filters for date selection
  const quickFilters = [
    'today',
    'tomorrow', 
    'this week',
    'this weekend',
    'next week',
    'later'
  ];
  
  const handleQuickFilterClick = (filter: string) => {
    if (selectedDateFilter === filter) {
      // If clicking the currently active filter, deselect it
      onDateFilterChange('');
      onDateRangeChange(undefined);
    } else {
      // Select the new filter and clear date range
      onDateFilterChange(filter);
      // Always clear any existing date range when selecting a quick filter
      onDateRangeChange(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className={cn(
        "flex flex-wrap gap-2",
        isMobile && "grid grid-cols-2 gap-2"
      )}>
        {quickFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedDateFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilterClick(filter)}
            className={cn(
              "capitalize w-full",
              selectedDateFilter === filter ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : "",
              selectedDateFilter === filter ? "border-[#9b87f5]" : ""
            )}
          >
            {filter}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full"
        />
        
        {(dateRange || selectedDateFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              onReset();
              onDateFilterChange('');
            }}
            className="h-9 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
