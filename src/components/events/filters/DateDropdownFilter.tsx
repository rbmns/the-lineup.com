
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayText = selectedDateFilter && selectedDateFilter !== 'anytime' 
    ? selectedDateFilter 
    : 'DATE';

  const handleDateSelect = (filter: string) => {
    onDateFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md",
          "font-mono text-xs uppercase tracking-wide text-gray-700",
          "hover:bg-gray-50 hover:border-gray-300 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          selectedDateFilter && selectedDateFilter !== 'anytime' && "border-blue-300 bg-blue-50 text-blue-700"
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
        <span className="capitalize">{displayText}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleDateSelect('anytime')}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                "font-mono uppercase tracking-wide",
                (!selectedDateFilter || selectedDateFilter === 'anytime') ? "bg-blue-50 text-blue-700" : "text-gray-700"
              )}
            >
              Anytime
            </button>
            
            {dateFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleDateSelect(filter)}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                  "font-mono uppercase tracking-wide capitalize",
                  selectedDateFilter === filter ? "bg-blue-50 text-blue-700" : "text-gray-700"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
