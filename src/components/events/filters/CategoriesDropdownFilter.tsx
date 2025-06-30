
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoriesDropdownFilterProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  allEventTypes: string[];
}

export const CategoriesDropdownFilter: React.FC<CategoriesDropdownFilterProps> = ({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  allEventTypes
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

  const displayText = selectedCategories.length > 0 
    ? `Categories (${selectedCategories.length})`
    : 'Categories';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md",
          "font-mono text-xs uppercase tracking-wide text-gray-700",
          "hover:bg-gray-50 hover:border-gray-300 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          selectedCategories.length > 0 && "border-blue-300 bg-blue-50 text-blue-700"
        )}
      >
        <Grid3X3 className="h-3.5 w-3.5" />
        <span>{displayText}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="py-1">
            {/* Select/Deselect All Options */}
            <div className="px-4 py-2 border-b border-gray-100">
              <button
                onClick={() => {
                  selectedCategories.length === allEventTypes.length ? onDeselectAll() : onSelectAll();
                }}
                className="text-xs font-mono uppercase tracking-wide text-blue-600 hover:text-blue-800"
              >
                {selectedCategories.length === allEventTypes.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            {allEventTypes.map((category) => (
              <label
                key={category}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                  className="mr-3 rounded"
                />
                <span className="text-sm font-mono uppercase tracking-wide text-gray-700">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
