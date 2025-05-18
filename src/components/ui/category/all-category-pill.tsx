
import React from 'react';
import { cn } from '@/lib/utils';
import { CategoryPillProps } from './category-pill-types';

export const AllCategoryPill: React.FC<Omit<CategoryPillProps, 'category'>> = ({
  onClick,
  active = false,
  className,
  size = 'default'
}) => {
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };
  
  const baseClasses = 'rounded-full font-medium transition-colors flex items-center';
  
  // Use different styling for the "All" pill
  const allPillClasses = active
    ? 'bg-black text-white shadow-sm'
    : 'bg-gray-100 text-black hover:bg-gray-200';
  
  return (
    <div
      className={cn(
        baseClasses,
        allPillClasses,
        sizeClasses[size],
        'cursor-pointer hover:shadow-sm',
        className
      )}
      onClick={onClick}
    >
      <span>All</span>
    </div>
  );
};
