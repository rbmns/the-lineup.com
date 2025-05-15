
import React from 'react';
import { Calendar, Music, Globe, Users, Film, Book, Dumbbell, Utensils, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

type CategoryIconMapping = {
  [key: string]: React.ElementType;
};

const categoryIconMapping: CategoryIconMapping = {
  'music': Music,
  'concert': Music,
  'festival': Music,
  'conference': Users,
  'networking': Users,
  'meetup': Users,
  'community': Users,
  'fitness': Dumbbell,
  'sports': Dumbbell,
  'food': Utensils,
  'dining': Utensils,
  'film': Film, 
  'movie': Film,
  'literature': Book,
  'reading': Book,
  'culture': Globe,
  'travel': Globe
};

const getCategoryIcon = (category: string): React.ElementType => {
  const lowerCategory = category.toLowerCase();
  
  // Check if there's a direct match
  for (const [key, Icon] of Object.entries(categoryIconMapping)) {
    if (lowerCategory === key || lowerCategory.includes(key)) {
      return Icon;
    }
  }
  
  // Default icon if no match
  return Tag;
};

const getCategoryColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  // Music related categories
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert') || 
      lowerCategory.includes('festival')) {
    return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  }
  
  // Community related categories
  if (lowerCategory.includes('conference') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup') || 
      lowerCategory.includes('community')) {
    return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  }
  
  // Active categories
  if (lowerCategory.includes('fitness') || 
      lowerCategory.includes('sports')) {
    return 'bg-green-100 text-green-800 hover:bg-green-200';
  }
  
  // Food related
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  }
  
  // Entertainment
  if (lowerCategory.includes('film') || 
      lowerCategory.includes('movie')) {
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  }
  
  // Literature
  if (lowerCategory.includes('literature') || 
      lowerCategory.includes('reading')) {
    return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
  }
  
  // Culture/Travel
  if (lowerCategory.includes('culture') || 
      lowerCategory.includes('travel')) {
    return 'bg-teal-100 text-teal-800 hover:bg-teal-200';
  }
  
  // Default
  return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
};

interface CategoryPillProps {
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
  const colorClasses = active 
    ? 'bg-purple-500 text-white' 
    : getCategoryColor(category);
    
  const sizeClasses = {
    'xs': 'text-xs py-0.5 px-1.5',
    'sm': 'text-xs py-1 px-2',
    'default': 'text-sm py-1.5 px-3',
    'lg': 'text-sm py-2 px-4 font-medium'
  };
  
  const iconSize = {
    'xs': 'h-3 w-3 mr-0.5',
    'sm': 'h-3.5 w-3.5 mr-1',
    'default': 'h-4 w-4 mr-1.5',
    'lg': 'h-4.5 w-4.5 mr-2'
  };
  
  return (
    <div
      className={cn(
        'rounded-full font-medium transition-colors cursor-pointer flex items-center',
        colorClasses,
        sizeClasses[size],
        onClick ? 'cursor-pointer' : 'cursor-default',
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={iconSize[size]} />}
      <span>{category}</span>
    </div>
  );
};
