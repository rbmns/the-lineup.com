
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
  // Base styles with more subtle rounded appearance
  const baseClasses = 'rounded-full font-medium transition-colors cursor-pointer flex items-center justify-center';
  
  // Use darker and lighter gray colors for active/inactive states
  const stateClasses = active 
    ? 'bg-gray-800 text-white hover:bg-gray-700'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  
  // Size classes - making them more compact to fit text better
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-2',
    'sm': 'text-xs py-1 px-2.5',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };

  // Always use "All" for the label
  const displayLabel = "All";

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
