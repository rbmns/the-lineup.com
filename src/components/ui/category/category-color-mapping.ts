
import { CategoryType } from './category-types';

export interface CategoryColorState {
  active: string;
  inactive: string;
}

const defaultColorState: CategoryColorState = {
  active: 'bg-gray-800 text-white',
  inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
};

// Mapping of category types to color classes
const categoryColorMap: Record<CategoryType, CategoryColorState> = {
  yoga: {
    active: 'bg-green-700 text-white',  // Darker, more vibrant variant
    inactive: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  surf: {
    active: 'bg-blue-700 text-white',  // Darker variant
    inactive: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  beach: {
    active: 'bg-yellow-600 text-white',  // Darker variant
    inactive: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  music: {
    active: 'bg-purple-700 text-white',  // Darker variant
    inactive: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
  },
  food: {
    active: 'bg-red-700 text-white',  // Darker variant
    inactive: 'bg-red-100 text-red-800 hover:bg-red-200'
  },
  community: {
    active: 'bg-indigo-700 text-white',  // Darker variant
    inactive: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
  },
  wellness: {
    active: 'bg-teal-700 text-white',  // Darker variant
    inactive: 'bg-teal-100 text-teal-800 hover:bg-teal-200'
  },
  kite: {
    active: 'bg-cyan-700 text-white',  // Darker variant
    inactive: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200'
  },
  sports: {
    active: 'bg-emerald-700 text-white',  // Darker variant
    inactive: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
  },
  party: {
    active: 'bg-pink-700 text-white',  // Darker variant
    inactive: 'bg-pink-100 text-pink-800 hover:bg-pink-200'
  },
  game: { 
    active: 'bg-violet-700 text-white',  // Darker variant
    inactive: 'bg-violet-100 text-violet-800 hover:bg-violet-200'
  },
  water: {
    active: 'bg-sky-700 text-white',  // Darker variant
    inactive: 'bg-sky-100 text-sky-800 hover:bg-sky-200'
  },
  festival: {
    active: 'bg-amber-700 text-white',  // Darker variant
    inactive: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
  },
  market: { 
    active: 'bg-orange-700 text-white',  // Darker variant
    inactive: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
  },
  other: {
    active: 'bg-gray-700 text-white',  // Darker variant
    inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
};

export const getCategoryColorState = (category: string): CategoryColorState => {
  const normalizedCategory = category?.toLowerCase() as CategoryType;
  return categoryColorMap[normalizedCategory] || defaultColorState;
};

export const getCategoryColor = (category: string, isActive = false): string => {
  const colorState = getCategoryColorState(category);
  return isActive ? colorState.active : colorState.inactive;
};
