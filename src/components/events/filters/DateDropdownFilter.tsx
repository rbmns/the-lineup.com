
import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

  const handleDateFilterSelect = (filter: string) => {
    const newFilter = selectedDateFilter === filter ? 'anytime' : filter;
    onDateFilterChange(newFilter);
    setOpen(false);
  };

  const displayText = selectedDateFilter === 'anytime' || !selectedDateFilter ? "When" : selectedDateFilter;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 border-sage/40 bg-coconut text-midnight rounded-md font-mono text-xs font-medium hover:bg-sage/20 hover:border-sage/60 transition-all duration-200"
        >
          <Calendar className="h-4 w-4 text-ocean-deep" />
          <span className="lowercase">{displayText}</span>
          {selectedDateFilter && selectedDateFilter !== 'anytime' && (
            <span className="px-1.5 py-0.5 bg-vibrant-aqua/20 text-midnight/90 rounded-full text-xs font-medium">
              1
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-driftwood" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-coconut border-sage/40 shadow-elevated rounded-md" align="start">
        <div className="py-2">
          {/* Anytime option */}
          <button
            onClick={() => handleDateFilterSelect('anytime')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-sage/20 transition-colors font-mono ${
              selectedDateFilter === 'anytime' || !selectedDateFilter ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-midnight'
            }`}
          >
            anytime
          </button>
          
          {/* Divider */}
          <div className="border-t border-sage/30 my-1" />
          
          {/* Date filters */}
          {dateFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleDateFilterSelect(filter)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-sage/20 transition-colors lowercase font-mono ${
                selectedDateFilter === filter ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-midnight'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
