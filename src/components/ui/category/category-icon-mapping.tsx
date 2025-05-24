
import { 
  Music, Award, Heart, Wind, Waves, Gamepad, MoreHorizontal, 
  Trophy, Pizza, ShoppingCart, UsersRound, Droplet, Palette 
} from 'lucide-react';
import React from 'react';

export const getCategoryIcon = (category: string): React.FC<React.SVGProps<SVGSVGElement>> => {
  const lowerCategory = category.toLowerCase();
  
  // Icon mapping based on category
  const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'festival': Award,
    'wellness': Heart,
    'kite': Wind,
    'beach': Waves,
    'game': Gamepad,
    'other': MoreHorizontal,
    'sports': Trophy,
    'surf': Waves,
    'party': Award,
    'yoga': Heart,
    'community': UsersRound,
    'water': Droplet,
    'music': Music,
    'food': Pizza,
    'market': ShoppingCart,
    'art & culture': Palette
  };
  
  // Return the icon component for the category, or a default if not found
  return categoryIcons[lowerCategory] || MoreHorizontal;
};
