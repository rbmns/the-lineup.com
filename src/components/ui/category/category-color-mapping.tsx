
import { cn } from '@/lib/utils';

interface CategoryColorState {
  active: string;
  inactive: string;
}

export const getCategoryColorState = (category: string): CategoryColorState => {
  const lowerCategory = category.toLowerCase();
  
  // Color mapping based on category with both active and inactive states
  // Making active states darker versions of inactive states
  const categoryColors: Record<string, CategoryColorState> = {
    'festival': {
      active: 'bg-orange-600 text-white hover:bg-orange-700',
      inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    },
    'wellness': {
      active: 'bg-lime-600 text-white hover:bg-lime-700',
      inactive: 'bg-lime-100 text-lime-700 hover:bg-lime-200'
    },
    'kite': {
      active: 'bg-teal-600 text-white hover:bg-teal-700',
      inactive: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
    },
    'beach': {
      active: 'bg-yellow-600 text-white hover:bg-yellow-700',
      inactive: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    },
    'game': {
      active: 'bg-purple-700 text-white hover:bg-purple-800',
      inactive: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    'other': {
      active: 'bg-gray-600 text-white hover:bg-gray-700',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },
    'sports': {
      active: 'bg-green-600 text-white hover:bg-green-700',
      inactive: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    'surf': {
      active: 'bg-cyan-600 text-white hover:bg-cyan-700',
      inactive: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
    },
    'party': {
      active: 'bg-rose-600 text-white hover:bg-rose-700',
      inactive: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
    },
    'yoga': {
      active: 'bg-lime-600 text-white hover:bg-lime-700',
      inactive: 'bg-lime-50 text-lime-700 hover:bg-lime-100'
    },
    'community': {
      active: 'bg-purple-600 text-white hover:bg-purple-700',
      inactive: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    'water': {
      active: 'bg-sky-600 text-white hover:bg-sky-700',
      inactive: 'bg-sky-100 text-sky-700 hover:bg-sky-200'
    },
    'music': {
      active: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700',
      inactive: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200'
    },
    'food': {
      active: 'bg-red-600 text-white hover:bg-red-700',
      inactive: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    'market': {
      active: 'bg-orange-600 text-white hover:bg-orange-700',
      inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  };
  
  // Return the color classes for the category, or a default if not found
  return categoryColors[lowerCategory] || {
    active: 'bg-gray-600 text-white hover:bg-gray-700',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };
};

// For backward compatibility
export const getCategoryColor = (category: string, isActive: boolean = true): string => {
  const colorState = getCategoryColorState(category);
  return isActive ? colorState.active : colorState.inactive;
};
