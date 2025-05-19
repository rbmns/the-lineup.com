
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

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
  // Base styles with more distinct button appearance
  const baseClasses = 'rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer border';
  
  // Active/inactive state colors - using more distinct styling
  const stateClasses = active 
    ? 'bg-gray-900 text-white hover:bg-gray-800 border-gray-900'
    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300';
  
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };

  // Determine which icon to show based on the select all state
  const IconComponent = isSelectAll ? Check : X;
  
  return (
    <div
      className={cn(
        baseClasses,
        stateClasses,
        sizeClasses[size],
        'hover:shadow-sm',
        className
      )}
      onClick={onClick || (() => {})}
    >
      <IconComponent className="h-3.5 w-3.5" />
      <span>{label || (isSelectAll ? "Select all" : "Deselect all")}</span>
    </div>
  );
};
