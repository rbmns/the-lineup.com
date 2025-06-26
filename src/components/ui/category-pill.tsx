
import React from 'react';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from './category/category-icon-mapping';
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
  
  // Coastal pill styling with improved accessibility
  const baseClasses = 'rounded-sm font-mono text-xs transition-colors flex items-center border border-overcast';
  
  // Accessible color scheme with midnight text
  const colorClasses = active || showIcon
    ? 'bg-seafoam text-midnight border-overcast'
    : 'bg-sage text-midnight hover:bg-seafoam hover:text-midnight border-overcast';
  
  // Coastal sizing
  const sizeClasses = {
    'xs': 'py-1 px-2',
    'sm': 'py-1.5 px-3',
    'default': 'py-2 px-4',
    'lg': 'py-2.5 px-5'
  };
  
  const interactiveClasses = onClick 
    ? 'cursor-pointer' 
    : 'cursor-default';
  
  return (
    <div
      className={cn(
        baseClasses,
        colorClasses,
        sizeClasses[size],
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {showIcon && Icon && <Icon className="mr-2 h-3 w-3" />}
      <span className="lowercase">{category}</span>
      {children}
    </div>
  );
};
