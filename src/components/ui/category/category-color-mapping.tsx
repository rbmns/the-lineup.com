
import { cn } from '@/lib/utils';

export const getCategoryColor = (category: string) => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('festival')) {
    return cn('bg-orange-300 text-black');
  } 
  
  if (lowerCategory.includes('wellness')) {
    return cn('bg-green-300 text-black');
  }
  
  if (lowerCategory.includes('kite')) {
    return cn('bg-green-200 text-black');
  }
  
  if (lowerCategory.includes('beach')) {
    return cn('bg-yellow-200 text-black');
  }
  
  if (lowerCategory.includes('game')) {
    return cn('bg-purple-300 text-black');
  }
  
  if (lowerCategory.includes('other')) {
    return cn('bg-gray-200 text-black');
  }
  
  if (lowerCategory.includes('sports')) {
    return cn('bg-green-400 text-black');
  }
  
  if (lowerCategory.includes('surf')) {
    return cn('bg-cyan-400 text-black');
  }
  
  if (lowerCategory.includes('party')) {
    return cn('bg-pink-300 text-black');
  }
  
  if (lowerCategory.includes('yoga')) {
    return cn('bg-lime-200 text-black');
  }
  
  if (lowerCategory.includes('community')) {
    return cn('bg-purple-400 text-white');
  }
  
  if (lowerCategory.includes('water')) {
    return cn('bg-cyan-300 text-black');
  }
  
  if (lowerCategory.includes('music')) {
    return cn('bg-fuchsia-300 text-black');
  }
  
  if (lowerCategory.includes('food')) {
    return cn('bg-red-400 text-white');
  }
  
  if (lowerCategory.includes('market')) {
    return cn('bg-orange-400 text-black');
  }
  
  // Default
  return cn('bg-gray-100 text-gray-800');
};
