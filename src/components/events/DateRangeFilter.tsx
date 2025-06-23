
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
  onReset,
  selectedDateFilter,
  onDateFilterChange,
  className
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useIsMobile();

  const quickDateOptions = [
    { label: 'Anytime', value: 'anytime' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Weekend', value: 'this-weekend' },
    { label: 'Next Week', value: 'next-week' },
    { label: 'This Month', value: 'this-month' },
  ];

  const handleQuickDateSelect = (value: string) => {
    onDateFilterChange(value);
    if (value === 'anytime') {
      onDateRangeChange(undefined);
    }
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return 'Select dates';
    if (!range.to) return format(range.from, 'MMM dd');
    return `${format(range.from, 'MMM dd')} - ${format(range.to, 'MMM dd')}`;
  };

  const hasActiveFilter = dateRange?.from || selectedDateFilter !== 'anytime';

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quick date filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {quickDateOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedDateFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickDateSelect(option.value)}
              className={cn(
                "text-xs px-2 py-1 h-7 rounded-full transition-colors",
                selectedDateFilter === option.value 
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : "border-gray-200 text-neutral hover:bg-primary/5"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom date range picker */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Or select a custom date range:</p>
        <div className="flex items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal h-9 text-sm",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className={cn(
                "w-auto p-0 bg-white border border-gray-200 shadow-lg z-50",
                isMobile && "w-[calc(100vw-2rem)]"
              )} 
              align="start"
              sideOffset={4}
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  onDateRangeChange(range);
                  onDateFilterChange('custom');
                  if (range?.from && range?.to) {
                    setIsCalendarOpen(false);
                  }
                }}
                numberOfMonths={isMobile ? 1 : 2}
                className={cn(
                  "p-3 pointer-events-auto",
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
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                    "h-8 w-8"
                  ),
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_range_start: "day-range-start rounded-l-md",
                  day_range_end: "day-range-end rounded-r-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </PopoverContent>
          </Popover>
          
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 w-9 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear date filter</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
