
import React from 'react';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from './category/category-icon-mapping';
import { getCategoryColor } from './category/category-color-mapping';
import { CategoryPillProps } from './category/category-pill-types';
export { AllCategoryPill } from './category/all-category-pill';

export const CategoryPill: React.FC<CategoryPillProps & { noBorder?: boolean }> = ({
  category,
  onClick,
  active = false,
  showIcon = false,
  className,
  size = 'default',
  children,
  noBorder = false
}) => {
  const Icon = getCategoryIcon(category);
  const colorClasses = getCategoryColor(category);
  
  // Base styles for all pills
  const baseClasses = 'rounded-full font-medium transition-colors flex items-center';
  
  // Border styles - only apply if noBorder is false
  const borderClasses = !noBorder ? 
    (active ? 'border-2 border-black shadow-sm' : 'border border-gray-300') : '';
  
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };
  
  // Icon sizes based on pill size
  const iconSize = {
    'xs': 'h-3 w-3 mr-0.5',
    'sm': 'h-3.5 w-3.5 mr-1',
    'default': 'h-4 w-4 mr-1.5',
    'lg': 'h-4.5 w-4.5 mr-2'
  };
  
  // Interactive classes
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-sm' 
    : 'cursor-default';
  
  return (
    <div
      className={cn(
        baseClasses,
        colorClasses,
        borderClasses,
        sizeClasses[size],
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={iconSize[size]} />}
      <span>{category}</span>
      {children}
    </div>
  );
};
