
import React from 'react';
import { cn } from '@/lib/utils';

interface AllCategoryPillProps {
  active?: boolean;
  onClick: () => void;
  size?: 'xs' | 'sm' | 'default' | 'lg';
  className?: string;
}

export const AllCategoryPill: React.FC<AllCategoryPillProps> = ({
  active = false,
  onClick,
  size = 'default',
  className
}) => {
  // Base styles
  const baseClasses = 'rounded-full font-medium transition-colors flex items-center cursor-pointer';
  
  // Active/inactive state colors
  const stateClasses = active 
    ? 'bg-slate-800 text-white hover:bg-slate-900'
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
  
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
        'hover:shadow-sm',
        className
      )}
      onClick={onClick}
    >
      <span>All</span>
    </div>
  );
};
