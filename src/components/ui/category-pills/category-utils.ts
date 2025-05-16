
import { 
  Music, 
  Waves, 
  Umbrella, 
  Utensils, 
  Users, 
  Calendar, 
  MapPin, 
  Heart, 
  Leaf, 
  Bike, 
  Trophy, 
  PartyPopper, 
  Gamepad, 
  Droplets, 
  Tent 
} from 'lucide-react';

// Get the correct icon component for each category
export const getCategoryIcon = (category: string) => {
  const normalizedCategory = category?.toLowerCase() || 'event';
  
  switch (normalizedCategory) {
    case 'yoga':
      return Leaf;
    case 'surf':
      return Waves;
    case 'beach':
      return Umbrella;
    case 'music':
      return Music;
    case 'food':
      return Utensils;
    case 'community':
      return Users;
    case 'wellness':
      return Heart;
    case 'kite':
      return Waves;
    case 'sports':
      return Bike;
    case 'other':
      return Trophy;
    case 'party':
      return PartyPopper;
    case 'game':
      return Gamepad;
    case 'water':
      return Droplets;
    case 'festival':
      return Tent;
    case 'market':
      return Users;
    case 'location':
      return MapPin;
    case 'event':
    default:
      return Calendar;
  }
};

// For backward compatibility - these will not be used in the new design
export const getCategoryColor = (category: string) => {
  // We return a blank string as we're now handling colors directly in the CategoryPill component
  return '';
};
