
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
  
  // Bohemian coastal pill styling
  const baseClasses = 'rounded-full font-mono text-xs font-medium transition-all duration-200 flex items-center border';
  
  // Category pills use clay background
  const colorClasses = active || showIcon
    ? 'bg-clay/10 text-midnight/90 border-clay/20'
    : 'bg-sage/20 text-midnight/80 hover:bg-clay/10 hover:text-midnight/90 border-sage/30';
  
  // Consistent sizing
  const sizeClasses = {
    'xs': 'px-2 py-0.5',
    'sm': 'px-2.5 py-1',
    'default': 'px-3 py-1.5',
    'lg': 'px-4 py-2'
  };
  
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:-translate-y-0.5' 
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
      {showIcon && Icon && <Icon className="mr-1.5 h-3 w-3" />}
      <span className="lowercase">{category}</span>
      {children}
    </div>
  );
};
