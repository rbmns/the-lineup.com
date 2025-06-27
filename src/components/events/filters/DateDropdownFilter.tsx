
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateFilterPill } from '@/components/events/DateFilterPill';

interface DateDropdownFilterProps {
  selectedDateFilter: string;
  onDateFilterChange: (filter: string) => void;
  dateFilters: string[];
}

export const DateDropdownFilter: React.FC<DateDropdownFilterProps> = ({
  selectedDateFilter,
  onDateFilterChange,
  dateFilters
}) => {
  const [open, setOpen] = useState(false);

  const displayText = selectedDateFilter && selectedDateFilter !== 'anytime' 
    ? selectedDateFilter 
    : 'When';

  const toggleDateFilter = (filter: string) => {
    const newFilter = selectedDateFilter === filter ? 'anytime' : filter;
    onDateFilterChange(newFilter);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-gray-300 rounded-lg"
        >
          <span className="text-sm font-medium capitalize">{displayText}</span>
          {selectedDateFilter && selectedDateFilter !== 'anytime' && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              1
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Select Date</h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onDateFilterChange('anytime')}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all font-medium ${
                selectedDateFilter === 'anytime' || !selectedDateFilter
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              Anytime
            </button>
            {dateFilters.map((filter) => (
              <DateFilterPill
                key={filter}
                label={filter}
                active={selectedDateFilter === filter}
                onClick={() => toggleDateFilter(filter)}
                className="text-sm"
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
