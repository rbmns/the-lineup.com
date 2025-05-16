
import React from 'react';
import { cn } from '@/lib/utils';
import { getCategoryColor, getCategoryIcon } from './category-utils';

export interface CategoryPillProps {
  category: string;
  onClick?: () => void;
  active?: boolean;
  showIcon?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg';
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  onClick,
  active = false,
  showIcon = false,
  className,
  size = 'default'
}) => {
  const Icon = getCategoryIcon(category);
  
  // Size classes
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-4',
    'lg': 'text-sm py-2 px-5 font-medium'
  };
  
  // Icon sizes based on pill size
  const iconSize = {
    'xs': 'h-3 w-3 mr-0.5',
    'sm': 'h-3.5 w-3.5 mr-1',
    'default': 'h-4 w-4 mr-1.5',
    'lg': 'h-4.5 w-4.5 mr-2'
  };
  
  // Get custom pill color based on category
  const getCategoryBackgroundColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    // Color mapping based on your design images
    switch (categoryLower) {
      case 'festival': return active ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-800';
      case 'wellness': return active ? 'bg-green-400 text-white' : 'bg-green-100 text-green-800';
      case 'kite': return active ? 'bg-teal-400 text-white' : 'bg-teal-100 text-teal-800';
      case 'beach': return active ? 'bg-yellow-400 text-white' : 'bg-yellow-100 text-yellow-800';
      case 'game': return active ? 'bg-purple-400 text-white' : 'bg-purple-100 text-purple-800';
      case 'other': return active ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-800';
      case 'sports': return active ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800';
      case 'surf': return active ? 'bg-cyan-400 text-white' : 'bg-cyan-100 text-cyan-800';
      case 'party': return active ? 'bg-pink-400 text-white' : 'bg-pink-100 text-pink-800';
      case 'yoga': return active ? 'bg-lime-400 text-white' : 'bg-lime-100 text-lime-800';
      case 'community': return active ? 'bg-violet-400 text-white' : 'bg-violet-100 text-violet-800';
      case 'water': return active ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-800';
      case 'music': return active ? 'bg-fuchsia-400 text-white' : 'bg-fuchsia-100 text-fuchsia-800';
      case 'food': return active ? 'bg-red-400 text-white' : 'bg-red-100 text-red-800';
      case 'market': return active ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-800';
      default: return active ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-800';
    }
  };
  
  // Categories without using the color utils
  const pillStyles = getCategoryBackgroundColor(category);
  
  return (
    <div
      className={cn(
        'rounded-full font-medium transition-colors flex items-center cursor-pointer',
        pillStyles,
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={iconSize[size]} />}
      <span>{category}</span>
    </div>
  );
};
