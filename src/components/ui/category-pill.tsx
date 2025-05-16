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
    return 'bg-amber-500 text-white hover:bg-amber-600';
  }
  
  // Wellness - Lime Green
  if (lowerCategory.includes('wellness')) {
    return 'bg-lime-500 text-white hover:bg-lime-600';
  }
  
  // Kite - Deep Teal
  if (lowerCategory.includes('kite')) {
    return 'bg-[#005F73] text-white hover:bg-opacity-90';
  }
  
  // Beach - Soft Orange
  if (lowerCategory.includes('beach')) {
    return 'bg-[#FFCC99] text-[#CA6702] hover:bg-[#FFBB77]';
  }
  
  // Game - Purple
  if (lowerCategory.includes('game')) {
    return 'bg-purple-600 text-white hover:bg-purple-700';
  }
  
  // Sports
  if (lowerCategory.includes('sports') || lowerCategory.includes('fitness')) {
    return 'bg-[#66CC66] text-white hover:bg-[#55BB55]';
  }
  
  // Surf
  if (lowerCategory.includes('surf')) {
    return 'bg-[#0099CC] text-white hover:bg-[#0088BB]';
  }
  
  // Party - Coral
  if (lowerCategory.includes('party')) {
    return 'bg-[#FF6666] text-white hover:bg-[#FF5555]';
  }
  
  // Yoga - Bright Green
  if (lowerCategory.includes('yoga')) {
    return 'bg-[#99CC33] text-white hover:bg-[#88BB22]';
  }
  
  // Community - Purple
  if (lowerCategory.includes('community') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup')) {
    return 'bg-[#9966FF] text-white hover:bg-[#8855EE]';
  }
  
  // Water - Teal
  if (lowerCategory.includes('water')) {
    return 'bg-[#00CCCC] text-white hover:bg-[#00BBBB]';
  }
  
  // Music - Purple/Blue
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert')) {
    return 'bg-[#5E60CE] text-white hover:bg-[#4D4FBD]';
  }
  
  // Food - Coral Red
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-[#FF6666] text-white hover:bg-[#FF5555]';
  }
  
  // Market - Orange
  if (lowerCategory.includes('market')) {
    return 'bg-[#FF9933] text-white hover:bg-[#FF8822]';
  }
  
  // Other - Gray (default)
  if (lowerCategory.includes('other')) {
    return 'bg-gray-600 text-white hover:bg-gray-700';
  }
  
  // Default - if no match is found
  return 'bg-gray-600 text-white hover:bg-gray-700';
};

// Get inactive color style for a category (much lighter version)
const getInactiveColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  // Festival - Amber/Orange
  if (lowerCategory.includes('festival')) {
    return 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200';
  }
  
  // Wellness - Lime Green
  if (lowerCategory.includes('wellness')) {
    return 'bg-lime-50 text-lime-700 border border-lime-200 hover:bg-lime-100';
  }
  
  // Kite - Deep Teal
  if (lowerCategory.includes('kite')) {
    return 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100';
  }
  
  // Beach - Soft Orange
  if (lowerCategory.includes('beach')) {
    return 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100';
  }
  
  // Game - Purple
  if (lowerCategory.includes('game')) {
    return 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100';
  }
  
  // Sports
  if (lowerCategory.includes('sports') || lowerCategory.includes('fitness')) {
    return 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100';
  }
  
  // Surf
  if (lowerCategory.includes('surf')) {
    return 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
  }
  
  // Party - Coral
  if (lowerCategory.includes('party')) {
    return 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100';
  }
  
  // Yoga - Bright Green
  if (lowerCategory.includes('yoga')) {
    return 'bg-lime-50 text-lime-700 border border-lime-200 hover:bg-lime-100';
  }
  
  // Community - Purple
  if (lowerCategory.includes('community') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup')) {
    return 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100';
  }
  
  // Water - Teal
  if (lowerCategory.includes('water')) {
    return 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100';
  }
  
  // Music - Purple/Blue
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert')) {
    return 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100';
  }
  
  // Food - Coral Red
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100';
  }
  
  // Market - Orange
  if (lowerCategory.includes('market')) {
    return 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100';
  }
  
  // Other - Gray (default)
  if (lowerCategory.includes('other') || lowerCategory === 'all') {
    return 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200';
  }
  
  // Default - if no match is found
  return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-200';
};

interface CategoryPillProps {
  category: string;
  onClick?: () => void;
  active?: boolean;
  showIcon?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg';
  isAll?: boolean;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  onClick,
  active = false,
  showIcon = false,
  className,
  size = 'default',
  isAll = false
}) => {
  const Icon = isAll ? Calendar : getCategoryIcon(category);
  
  // Use higher contrast between active and inactive states
  const colorClasses = active 
    ? (isAll ? 'bg-gray-800 text-white hover:bg-gray-900' : getCategoryColor(category)) 
    : getInactiveColor(isAll ? 'all' : category);
    
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
        'rounded-full font-medium transition-colors flex items-center',
        colorClasses,
        sizeClasses[size],
        onClick ? 'cursor-pointer' : 'cursor-default',
        active ? 'ring-2 ring-offset-1' : '',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? active : undefined}
    >
      {showIcon && <Icon className={iconSize[size]} />}
      <span>{category}</span>
    </div>
  );
};
