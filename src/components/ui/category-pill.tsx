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
    return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200';
  }
  
  // Wellness - Lime
  if (lowerCategory.includes('wellness')) {
    return 'bg-lime-100 text-lime-800 hover:bg-lime-200 border-lime-200';
  }
  
  // Kite - Ocean Deep
  if (lowerCategory.includes('kite')) {
    return 'bg-[#005F73] text-white hover:bg-opacity-90 border-[#005F73]';
  }
  
  // Beach - Sand
  if (lowerCategory.includes('beach')) {
    return 'bg-[#FFCC99] text-[#CA6702] hover:bg-opacity-90 border-[#FFCC99]';
  }
  
  // Game - Purple
  if (lowerCategory.includes('game')) {
    return 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200';
  }
  
  // Sports
  if (lowerCategory.includes('sports') || lowerCategory.includes('fitness')) {
    return 'bg-[#66CC66] text-white hover:bg-opacity-90 border-[#66CC66]';
  }
  
  // Surf
  if (lowerCategory.includes('surf')) {
    return 'bg-[#0099CC] text-white hover:bg-opacity-90 border-[#0099CC]';
  }
  
  // Party - Coral
  if (lowerCategory.includes('party')) {
    return 'bg-[#FF6666] text-white hover:bg-opacity-90 border-[#FF6666]';
  }
  
  // Yoga - Lime/Green
  if (lowerCategory.includes('yoga')) {
    return 'bg-[#99CC33] text-white hover:bg-opacity-90 border-[#99CC33]';
  }
  
  // Community - Dusk
  if (lowerCategory.includes('community') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup')) {
    return 'bg-[#9966FF] text-white hover:bg-opacity-90 border-[#9966FF]';
  }
  
  // Water - Teal
  if (lowerCategory.includes('water')) {
    return 'bg-[#00CCCC] text-white hover:bg-opacity-90 border-[#00CCCC]';
  }
  
  // Music - Twilight
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert')) {
    return 'bg-[#5E60CE] text-white hover:bg-opacity-90 border-[#5E60CE]';
  }
  
  // Food - Coral
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-[#FF6666] text-white hover:bg-opacity-90 border-[#FF6666]';
  }
  
  // Market - Sunset
  if (lowerCategory.includes('market')) {
    return 'bg-[#FF9933] text-white hover:bg-opacity-90 border-[#FF9933]';
  }
  
  // Other - Gray (default)
  if (lowerCategory.includes('other')) {
    return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';
  }
  
  // Default
  return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';
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
    ? 'bg-purple-600 text-white hover:bg-purple-700' 
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
        'rounded-full font-medium transition-colors flex items-center border',
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
