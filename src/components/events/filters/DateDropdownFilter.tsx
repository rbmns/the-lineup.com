
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
          className="flex items-center gap-2 h-10 px-3 border-ocean-deep/20 bg-coconut text-ocean-deep rounded-md font-mono text-xs font-medium uppercase tracking-wide hover:bg-vibrant-aqua/10 hover:border-vibrant-aqua/40 transition-all duration-200"
        >
          <Calendar className="h-4 w-4 text-vibrant-aqua" />
          <span>{displayText}</span>
          {selectedDateFilter && selectedDateFilter !== 'anytime' && (
            <span className="px-1.5 py-0.5 bg-vibrant-aqua/20 text-ocean-deep rounded-full text-xs font-medium">
              1
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-ocean-deep/70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-coconut border-ocean-deep/20 shadow-coastal rounded-md" align="start">
        <div className="py-2">
          {/* Anytime option */}
          <button
            onClick={() => handleDateFilterSelect('anytime')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
              selectedDateFilter === 'anytime' || !selectedDateFilter ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-ocean-deep'
            }`}
          >
            anytime
          </button>
          
          {/* Divider */}
          <div className="border-t border-ocean-deep/10 my-1" />
          
          {/* Date filters */}
          {dateFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleDateFilterSelect(filter)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-vibrant-aqua/10 transition-colors font-mono uppercase tracking-wide ${
                selectedDateFilter === filter ? 'bg-vibrant-aqua/20 font-medium text-ocean-deep' : 'text-ocean-deep'
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
