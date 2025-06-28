
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
  
  // Coastal pill styling with vibrant aqua accents
  const baseClasses = 'rounded-full font-mono text-xs font-medium transition-all duration-200 flex items-center border uppercase tracking-wide';
  
  // Category pills use vibrant aqua background when active, ocean-deep text
  const colorClasses = active || showIcon
    ? 'bg-vibrant-aqua/20 text-ocean-deep border-vibrant-aqua/30'
    : 'bg-ocean-deep/10 text-ocean-deep hover:bg-vibrant-aqua/10 hover:text-ocean-deep border-ocean-deep/20';
  
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
      {showIcon && Icon && <Icon className="mr-1.5 h-3 w-3 text-vibrant-aqua" />}
      <span>{category}</span>
      {children}
    </div>
  );
};
