
import React from 'react';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from './category/category-icon-mapping';
import { getCategoryColor, getCategoryColorState } from './category/category-color-mapping';
import { CategoryPillProps } from './category/category-pill-types';
export { AllCategoryPill } from './category/all-category-pill';

export const CategoryPill: React.FC<CategoryPillProps & { 
  noBorder?: boolean,
  visuallyInactive?: boolean 
}> = ({
  category,
  onClick,
  active = false,
  showIcon = false,
  className,
  size = 'default',
  children,
  noBorder = false,
  visuallyInactive = false
}) => {
  const Icon = getCategoryIcon(category);
  const colorState = getCategoryColorState(category);
  
  // For event cards, always use active colors for category labels
  // For filter pills, use appropriate colors based on selection state
  const colorClasses = showIcon || (!visuallyInactive && active)
    ? colorState.active
    : colorState.inactive;
  
  // Base styles for all pills
  const baseClasses = 'rounded-full font-medium transition-colors flex items-center';
  
  // Border styles - only apply if noBorder is false
  const borderClasses = !noBorder ? 
    (active ? 'border border-transparent shadow-sm' : 'border border-gray-300') : '';
  
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
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
      {showIcon && Icon && <Icon className="mr-1.5 h-4 w-4" />}
      <span>{category}</span>
      {children}
    </div>
  );
};
