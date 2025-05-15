
import React from 'react';
import { EventCategoryIcon } from './event-category-icon';
import { eventTypeColors } from '@/utils/eventImages';
import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: string;
  active?: boolean;
  onClick?: () => void;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  active = false,
  onClick,
  showIcon = false,
  className = '',
  size = 'default'
}) => {
  // Convert category to lowercase for consistency
  const normalizedCategory = category.toLowerCase();
  
  // Get colors from the shared utility
  const colorConfig = eventTypeColors[normalizedCategory as keyof typeof eventTypeColors] || eventTypeColors.other;
  
  // Define sizes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };
  
  // Base styling with hover and active states
  const pillClass = cn(
    colorConfig.default.bg,
    colorConfig.default.text,
    "font-medium rounded-full transition-all duration-200",
    active ? 'ring-2 ring-offset-1 ring-black' : '',
    onClick ? 'cursor-pointer hover:opacity-90' : '',
    sizeClasses[size],
    "inline-flex items-center justify-center",
    className
  );
  
  return (
    <div 
      className={pillClass}
      onClick={onClick}
    >
      {showIcon ? (
        <div className="flex items-center gap-1">
          <EventCategoryIcon category={normalizedCategory} size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} />
          <span>{category}</span>
        </div>
      ) : (
        <span>{category}</span>
      )}
    </div>
  );
};
