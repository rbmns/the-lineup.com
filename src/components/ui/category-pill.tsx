
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
  
  // Editorial pill styling - muted colors, minimal
  const baseClasses = 'rounded-sm font-mono text-xs transition-colors flex items-center border-0';
  
  // Simple color scheme - seafoam for active, clay for inactive
  const colorClasses = active || showIcon
    ? 'bg-seafoam-soft text-charcoal'
    : 'bg-clay-muted text-overcast hover:bg-seafoam-soft hover:text-charcoal';
  
  // Editorial sizing
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
      <span>{category}</span>
      {children}
    </div>
  );
};
