import { Book, Calendar, Dumbbell, Film, Gamepad, Globe, Leaf, Music, PartyPopper, Sailboat, Sun, Tag, Tent, Users, Utensils, Waves } from 'lucide-react';

export type CategoryIconMapping = {
  [key: string]: React.ElementType;
};

export const categoryIconMapping: CategoryIconMapping = {
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
  'market': Tag,
  'game': Gamepad,
  'other': Calendar
};

/**
 * Gets the appropriate icon component for a category
 */
export const getCategoryIcon = (category: string): React.ElementType => {
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

/**
 * Gets the appropriate color classes for a category
 */
export const getCategoryColor = (category: string): string => {
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
