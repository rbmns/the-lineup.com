
import { cn } from '@/lib/utils';

interface CategoryColorState {
  active: string;
  inactive: string;
}

export const getCategoryColorState = (category: string): CategoryColorState => {
  const lowerCategory = category.toLowerCase();
  
  // Use consistent colors for all event types - using #9b87f5 (Primary Purple) for active state
  const activeColor = 'bg-[#9b87f5] text-white hover:bg-[#8b77e5]';
  
  // Color mapping based on category with both active and inactive states
  const categoryColors: Record<string, CategoryColorState> = {
    'festival': {
      active: activeColor,
      inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    },
    'wellness': {
      active: activeColor,
      inactive: 'bg-lime-100 text-lime-700 hover:bg-lime-200'
    },
    'kite': {
      active: activeColor,
      inactive: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
    },
    'beach': {
      active: activeColor,
      inactive: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
    },
    'game': {
      active: activeColor,
      inactive: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    },
    'other': {
      active: activeColor,
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },
    'sports': {
      active: activeColor,
      inactive: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    'surf': {
      active: activeColor,
      inactive: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
    },
    'party': {
      active: activeColor,
      inactive: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
    },
    'yoga': {
      active: activeColor,
      inactive: 'bg-lime-50 text-lime-700 hover:bg-lime-100'
    },
    'community': {
      active: activeColor,
      inactive: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    'water': {
      active: activeColor,
      inactive: 'bg-sky-100 text-sky-700 hover:bg-sky-200'
    },
    'music': {
      active: activeColor,
      inactive: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200'
    },
    'food': {
      active: activeColor,
      inactive: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    'market': {
      active: activeColor,
      inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  };
  
  // Return the color classes for the category, or a default if not found
  return categoryColors[lowerCategory] || {
    active: activeColor,
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };
};

// For backward compatibility
export const getCategoryColor = (category: string, isActive: boolean = true): string => {
  const colorState = getCategoryColorState(category);
  return isActive ? colorState.active : colorState.inactive;
};
