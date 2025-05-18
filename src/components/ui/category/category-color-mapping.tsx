
import { cn } from '@/lib/utils';

interface CategoryColorState {
  active: string;
  inactive: string;
}

export const getCategoryColorState = (category: string): CategoryColorState => {
  const lowerCategory = category.toLowerCase();
  
  // Color mapping based on category with both active and inactive states
  const categoryColors: Record<string, CategoryColorState> = {
    'festival': {
      active: 'bg-orange-300 text-orange-900 hover:bg-orange-400',
      inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    },
    'wellness': {
      active: 'bg-lime-300 text-lime-900 hover:bg-lime-400',
      inactive: 'bg-lime-100 text-lime-700 hover:bg-lime-200'
    },
    'kite': {
      active: 'bg-teal-400 text-teal-900 hover:bg-teal-500',
      inactive: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
    },
    'beach': {
      active: 'bg-yellow-200 text-yellow-900 hover:bg-yellow-300',
      inactive: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
    },
    'game': {
      active: 'bg-indigo-300 text-indigo-900 hover:bg-indigo-400',
      inactive: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    },
    'other': {
      active: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },
    'sports': {
      active: 'bg-green-400 text-green-900 hover:bg-green-500',
      inactive: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    'surf': {
      active: 'bg-cyan-400 text-cyan-900 hover:bg-cyan-500',
      inactive: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
    },
    'party': {
      active: 'bg-rose-300 text-rose-900 hover:bg-rose-400',
      inactive: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
    },
    'yoga': {
      active: 'bg-lime-200 text-lime-900 hover:bg-lime-300',
      inactive: 'bg-lime-50 text-lime-700 hover:bg-lime-100'
    },
    'community': {
      active: 'bg-purple-400 text-purple-900 hover:bg-purple-500',
      inactive: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    'water': {
      active: 'bg-sky-400 text-sky-900 hover:bg-sky-500',
      inactive: 'bg-sky-100 text-sky-700 hover:bg-sky-200'
    },
    'music': {
      active: 'bg-fuchsia-400 text-fuchsia-900 hover:bg-fuchsia-500',
      inactive: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200'
    },
    'food': {
      active: 'bg-red-400 text-red-900 hover:bg-red-500',
      inactive: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    'market': {
      active: 'bg-orange-500 text-orange-50 hover:bg-orange-600',
      inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  };
  
  // Return the color classes for the category, or a default if not found
  return categoryColors[lowerCategory] || {
    active: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };
};

// For backward compatibility
export const getCategoryColor = (category: string, isActive: boolean = true): string => {
  const colorState = getCategoryColorState(category);
  return isActive ? colorState.active : colorState.inactive;
};
