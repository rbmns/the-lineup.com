
import React from 'react';
import { Calendar, Music, Globe, Users, Film, Book, Dumbbell, Utensils, Tag, Waves, Tent, Leaf, Sun, Sailboat, PartyPopper, BadgeCheck } from 'lucide-react';
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
  'market': BadgeCheck
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
  
  // Festival
  if (lowerCategory.includes('festival')) {
    return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
  }
  
  // Wellness
  if (lowerCategory.includes('wellness')) {
    return 'bg-lime-100 text-lime-800 hover:bg-lime-200';
  }
  
  // Kite
  if (lowerCategory.includes('kite')) {
    return 'bg-ocean-deep text-white hover:bg-opacity-90';
  }
  
  // Beach
  if (lowerCategory.includes('beach')) {
    return 'bg-sand text-sandstone hover:bg-opacity-90';
  }
  
  // Game
  if (lowerCategory.includes('game')) {
    return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  }
  
  // Sports
  if (lowerCategory.includes('sports') || lowerCategory.includes('fitness')) {
    return 'bg-leaf text-white hover:bg-opacity-90';
  }
  
  // Surf
  if (lowerCategory.includes('surf')) {
    return 'bg-ocean-medium text-white hover:bg-opacity-90';
  }
  
  // Party
  if (lowerCategory.includes('party')) {
    return 'bg-coral text-white hover:bg-opacity-90';
  }
  
  // Yoga
  if (lowerCategory.includes('yoga')) {
    return 'bg-lime text-white hover:bg-opacity-90';
  }
  
  // Community
  if (lowerCategory.includes('community') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup')) {
    return 'bg-dusk text-white hover:bg-opacity-90';
  }
  
  // Water
  if (lowerCategory.includes('water')) {
    return 'bg-teal text-white hover:bg-opacity-90';
  }
  
  // Music
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert')) {
    return 'bg-twilight text-white hover:bg-opacity-90';
  }
  
  // Food
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-coral text-white hover:bg-opacity-90';
  }
  
  // Market
  if (lowerCategory.includes('market')) {
    return 'bg-sunset text-white hover:bg-opacity-90';
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
        'rounded-full font-medium transition-colors flex items-center',
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
