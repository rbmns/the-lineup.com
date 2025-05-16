import React from 'react';
import { Calendar, Music, Globe, Users, Film, Book, Dumbbell, Utensils, Tag, Waves, Tent, Leaf, Sun, Sailboat, PartyPopper, BadgeCheck, Gamepad } from 'lucide-react';
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
  'travel': Globe,
  'water': Waves,
  'surf': Waves,
  'wellness': Leaf,
  'yoga': Leaf,
  'beach': Sun,
  'kite': Sailboat,
  'party': PartyPopper,
  'market': BadgeCheck,
  'game': Gamepad,
  'other': Calendar
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

// Enhanced color mapping based on the design system color palette
const getCategoryColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  // Festival - Amber/Orange
  if (lowerCategory.includes('festival')) {
    return 'bg-amber-500 text-white';
  }
  
  // Wellness - Lime Green
  if (lowerCategory.includes('wellness')) {
    return 'bg-lime-500 text-white';
  }
  
  // Kite - Deep Teal
  if (lowerCategory.includes('kite')) {
    return 'bg-[#005F73] text-white';
  }
  
  // Beach - Soft Orange
  if (lowerCategory.includes('beach')) {
    return 'bg-[#FFCC99] text-[#CA6702]';
  }
  
  // Game - Purple
  if (lowerCategory.includes('game')) {
    return 'bg-purple-600 text-white';
  }
  
  // Sports
  if (lowerCategory.includes('sports') || lowerCategory.includes('fitness')) {
    return 'bg-[#66CC66] text-white';
  }
  
  // Surf
  if (lowerCategory.includes('surf')) {
    return 'bg-[#0099CC] text-white';
  }
  
  // Party - Coral
  if (lowerCategory.includes('party')) {
    return 'bg-[#FF6666] text-white';
  }
  
  // Yoga - Bright Green
  if (lowerCategory.includes('yoga')) {
    return 'bg-[#99CC33] text-white';
  }
  
  // Community - Purple
  if (lowerCategory.includes('community') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup')) {
    return 'bg-[#9966FF] text-white';
  }
  
  // Water - Teal
  if (lowerCategory.includes('water')) {
    return 'bg-[#00CCCC] text-white';
  }
  
  // Music - Purple/Blue
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert')) {
    return 'bg-[#5E60CE] text-white';
  }
  
  // Food - Coral Red
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-[#FF6666] text-white';
  }
  
  // Market - Orange
  if (lowerCategory.includes('market')) {
    return 'bg-[#FF9933] text-white';
  }
  
  // Other - Gray (default)
  if (lowerCategory.includes('other')) {
    return 'bg-gray-600 text-white';
  }
  
  // Default - if no match is found
  return 'bg-gray-600 text-white';
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
  const colorClasses = getCategoryColor(category);
  
  // Base styles for all pills
  const baseClasses = 'rounded-full font-medium transition-colors flex items-center';
  
  // Border styles - darker border when active, lighter when inactive
  const borderClasses = active 
    ? 'border-2 border-black shadow-sm' 
    : 'border border-gray-300';
  
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
  
  // Opacity for inactive pills
  const opacityClasses = active ? 'opacity-100' : 'opacity-80 hover:opacity-100';
  
  // Interactive classes
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-md' 
    : 'cursor-default';
  
  return (
    <div
      className={cn(
        baseClasses,
        colorClasses,
        borderClasses,
        sizeClasses[size],
        opacityClasses,
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={iconSize[size]} />}
      <span>{category}</span>
    </div>
  );
};

// Add a special "All" category pill that's different from regular category pills
export const AllCategoryPill: React.FC<Omit<CategoryPillProps, 'category'>> = ({
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
