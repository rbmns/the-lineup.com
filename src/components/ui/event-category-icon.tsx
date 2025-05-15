
import React from 'react';
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
import { cn } from '@/lib/utils';

// Define the allowed icon sizes
export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

interface EventCategoryIconProps {
  category: string;
  size?: IconSize;
  className?: string;
}

export const EventCategoryIcon: React.FC<EventCategoryIconProps> = ({ 
  category, 
  size = 'md',
  className = '' 
}) => {
  const normalizedCategory = category?.toLowerCase() || 'event';
  
  // Map sizes to pixel values
  const sizeMap: Record<IconSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24
  };
  
  // Get the actual pixel size
  const pixelSize = sizeMap[size];
  
  // Determine the icon based on category
  const getIcon = () => {
    switch (normalizedCategory) {
      case 'yoga':
        return <Leaf size={pixelSize} className={cn(className)} />;
      case 'surf':
        return <Waves size={pixelSize} className={cn(className)} />;
      case 'beach':
        return <Umbrella size={pixelSize} className={cn(className)} />;
      case 'music':
        return <Music size={pixelSize} className={cn(className)} />;
      case 'food':
        return <Utensils size={pixelSize} className={cn(className)} />;
      case 'community':
        return <Users size={pixelSize} className={cn(className)} />;
      case 'wellness':
        return <Heart size={pixelSize} className={cn(className)} />;
      case 'kite':
        return <Waves size={pixelSize} className={cn(className)} />;
      case 'sports':
        return <Bike size={pixelSize} className={cn(className)} />;
      case 'other':
        return <Trophy size={pixelSize} className={cn(className)} />;
      case 'party':
        return <PartyPopper size={pixelSize} className={cn(className)} />;
      case 'game':
        return <Gamepad size={pixelSize} className={cn(className)} />;
      case 'water':
        return <Droplets size={pixelSize} className={cn(className)} />;
      case 'festival':
        return <Tent size={pixelSize} className={cn(className)} />;
      case 'market':
        return <Users size={pixelSize} className={cn(className)} />;
      case 'location':
        return <MapPin size={pixelSize} className={cn(className)} />;
      case 'event':
      default:
        return <Calendar size={pixelSize} className={cn(className)} />;
    }
  };

  return getIcon();
};
