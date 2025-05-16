
import React from 'react';
import { cn } from '@/lib/utils';

export interface AllCategoryPillProps {
  onClick?: () => void;
  active?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg';
}

export const AllCategoryPill: React.FC<AllCategoryPillProps> = ({
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
    ? 'bg-black text-white border-2 border-black shadow-sm'
    : 'bg-white text-black border border-gray-300 hover:bg-gray-50';
  
  return (
    <div
      className={cn(
        baseClasses,
        allPillClasses,
        sizeClasses[size],
        'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <span>All</span>
    </div>
  );
};
