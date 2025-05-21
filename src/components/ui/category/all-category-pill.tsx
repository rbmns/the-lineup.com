
import React from 'react';
import { cn } from '@/lib/utils';

interface AllCategoryPillProps {
  active?: boolean;
  onClick?: () => void;
  size?: 'xs' | 'sm' | 'default' | 'lg';
  className?: string;
  label?: string;
  isSelectAll?: boolean;
}

export const AllCategoryPill: React.FC<AllCategoryPillProps> = ({
  active = false,
  onClick,
  size = 'default',
  className,
  label,
  isSelectAll = true
}) => {
  // Base styles with more distinct active/inactive states
  const baseClasses = 'rounded-md font-medium transition-colors cursor-pointer border';
  
  // Use a darker, more prominent active state
  const stateClasses = active 
    ? 'bg-twilight text-white hover:bg-night shadow-sm border-transparent font-semibold'
    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200';
  
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };

  // Dynamic label based on active state and isSelectAll prop
  // When none selected or all selected, show "All" instead of "Select all"
  const displayLabel = label || (active ? "All" : isSelectAll ? "Select all" : "Deselect all");

  return (
    <div
      className={cn(
        baseClasses,
        stateClasses,
        sizeClasses[size],
        className
      )}
      onClick={onClick || (() => {})}
      role="button"
      tabIndex={0}
      aria-pressed={active}
    >
      <span>{displayLabel}</span>
    </div>
  );
};
