
import { cn } from '@/lib/utils';

export const getCategoryColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  // Color mapping based on category
  const categoryColors: Record<string, string> = {
    'festival': 'bg-orange-300 text-orange-900 hover:bg-orange-400',
    'wellness': 'bg-lime-300 text-lime-900 hover:bg-lime-400',
    'kite': 'bg-teal-400 text-teal-900 hover:bg-teal-500',
    'beach': 'bg-yellow-200 text-yellow-900 hover:bg-yellow-300',
    'game': 'bg-indigo-300 text-indigo-900 hover:bg-indigo-400',
    'other': 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    'sports': 'bg-green-400 text-green-900 hover:bg-green-500',
    'surf': 'bg-cyan-400 text-cyan-900 hover:bg-cyan-500',
    'party': 'bg-rose-300 text-rose-900 hover:bg-rose-400',
    'yoga': 'bg-lime-200 text-lime-900 hover:bg-lime-300',
    'community': 'bg-purple-400 text-purple-900 hover:bg-purple-500',
    'water': 'bg-sky-400 text-sky-900 hover:bg-sky-500',
    'music': 'bg-fuchsia-400 text-fuchsia-900 hover:bg-fuchsia-500',
    'food': 'bg-red-400 text-red-900 hover:bg-red-500',
    'market': 'bg-orange-500 text-orange-50 hover:bg-orange-600'
  };
  
  // Return the color class for the category, or a default if not found
  return categoryColors[lowerCategory] || 'bg-gray-200 text-gray-900 hover:bg-gray-300';
};
