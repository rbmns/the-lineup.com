
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DATE_FILTER_OPTIONS } from '@/constants';

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
  // Use constants for quick filters to ensure consistency
  const quickFilters = [
    DATE_FILTER_OPTIONS.TODAY,
    DATE_FILTER_OPTIONS.THIS_WEEK,
    DATE_FILTER_OPTIONS.THIS_WEEKEND,
    DATE_FILTER_OPTIONS.LATER
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
      
      console.log(`Date filter applied: ${filter}`);
    }
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    // When setting a date range, always clear the quick filter
    if (newDateRange) {
      if (selectedDateFilter) {
        onDateFilterChange('');
      }
      
      console.log(`Date range applied:`, newDateRange);
    }
    
    // Always set the new date range directly, replacing any existing range
    onDateRangeChange(newDateRange);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedDateFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilterClick(filter)}
            className={cn(
              "capitalize",
              selectedDateFilter === filter ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : "",
              selectedDateFilter === filter ? "border-[#9b87f5]" : ""
            )}
          >
            {filter}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
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
