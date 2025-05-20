
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
  // Base styles with more subtle text-only appearance
  const baseClasses = 'rounded-md font-medium transition-colors cursor-pointer border';
  
  // Use colors from design-system.css for active state
  const stateClasses = active 
    ? 'bg-twilight text-white hover:bg-night shadow-sm border-transparent'
    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200';
  
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };

  return (
    <div
      className={cn(
        baseClasses,
        stateClasses,
        sizeClasses[size],
        className
      )}
      onClick={onClick || (() => {})}
    >
      <span>{label || (isSelectAll ? "Select all" : "Deselect all")}</span>
    </div>
  );
};
