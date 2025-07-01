
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFriendlyDatePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  onReset: () => void;
  onClose?: () => void;
  className?: string;
}

export const MobileFriendlyDatePicker: React.FC<MobileFriendlyDatePickerProps> = ({
  dateRange,
  onDateRangeChange,
  selectedDateFilter,
  onDateFilterChange,
  onReset,
  onClose,
  className
}) => {
  const isMobile = useIsMobile();

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from) {
      onDateFilterChange(''); // Clear quick filter when using custom range
      if (range.to && onClose) {
        // Close when full range is selected (only if onClose is provided)
        setTimeout(() => onClose(), 100);
      }
    }
  };

  const handleSingleDateSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from && !range.to && onClose) {
      // Close when single date is selected (only if onClose is provided)
      setTimeout(() => onClose(), 100);
    }
  };

  const hasActiveFilter = dateRange?.from;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear date filter</span>
            </Button>
          )}
        </div>
        
        {onClose && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Calendar
        initialFocus
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={handleDateRangeSelect}
        numberOfMonths={isMobile ? 1 : 2}
        className={cn(
          "pointer-events-auto",
          isMobile && "w-full"
        )}
        classNames={{
          months: isMobile ? "flex flex-col" : "flex flex-row space-x-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-accent hover:text-accent-foreground",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
            "h-8 w-8"
          ),
          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
          day_range_start: "day-range-start rounded-l-md",
          day_range_end: "day-range-end rounded-r-md",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
    </div>
  );
};
