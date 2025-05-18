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

// Updated color mapping based on the brand style guide nature palette
const getCategoryColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  // Festival - Amber tone
  if (lowerCategory.includes('festival')) {
    return 'bg-amber text-white';
  }
  
  // Wellness - Leaf green
  if (lowerCategory.includes('wellness')) {
    return 'bg-leaf text-white';
  }
  
  // Kite - Ocean Deep
  if (lowerCategory.includes('kite')) {
    return 'bg-ocean-deep text-white';
  }
  
  // Beach - Sand
  if (lowerCategory.includes('beach')) {
    return 'bg-sand text-sandstone';
  }
  
  // Game - Dusk (purple)
  if (lowerCategory.includes('game')) {
    return 'bg-dusk text-white';
  }
  
  // Sports - Leaf
  if (lowerCategory.includes('sports') || lowerCategory.includes('fitness')) {
    return 'bg-leaf text-white';
  }
  
  // Surf - Ocean Medium
  if (lowerCategory.includes('surf')) {
    return 'bg-ocean-medium text-white';
  }
  
  // Party - Coral
  if (lowerCategory.includes('party')) {
    return 'bg-coral text-white';
  }
  
  // Yoga - Lime
  if (lowerCategory.includes('yoga')) {
    return 'bg-lime text-white';
  }
  
  // Community - Dusk (purple)
  if (lowerCategory.includes('community') || 
      lowerCategory.includes('networking') ||
      lowerCategory.includes('meetup')) {
    return 'bg-dusk text-white';
  }
  
  // Water - Teal
  if (lowerCategory.includes('water')) {
    return 'bg-teal text-white';
  }
  
  // Music - Twilight
  if (lowerCategory.includes('music') || 
      lowerCategory.includes('concert')) {
    return 'bg-twilight text-white';
  }
  
  // Food - Coral
  if (lowerCategory.includes('food') || 
      lowerCategory.includes('dining')) {
    return 'bg-coral text-white';
  }
  
  // Market - Sunset
  if (lowerCategory.includes('market')) {
    return 'bg-sunset text-white';
  }
  
  // Other - Night (dark purple)
  if (lowerCategory.includes('other')) {
    return 'bg-night text-white';
  }
  
  // Default - if no match is found
  return 'bg-ocean-light text-jungle';
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
    ? 'bg-night text-white border-2 border-black shadow-sm'
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
