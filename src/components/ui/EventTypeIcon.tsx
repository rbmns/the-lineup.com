
import React from 'react';
import { Music, Waves, Umbrella, Utensils, Users, Calendar, MapPin, Heart, Leaf, Bike, Trophy, PartyPopper, Gamepad, Droplets, Tent } from 'lucide-react';

interface EventTypeIconProps {
  eventType: string;
  className?: string;
}

export const EventTypeIcon: React.FC<EventTypeIconProps> = ({ eventType, className = '' }) => {
  const type = eventType?.toLowerCase() || 'event';
  
  // Map event types to appropriate icons
  switch (type) {
    case 'yoga':
      return <Leaf className={className} />; 
    case 'surf':
      return <Waves className={className} />;
    case 'beach':
      return <Umbrella className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'food':
      return <Utensils className={className} />;
    case 'community':
      return <Users className={className} />;
    case 'wellness':
      return <Heart className={className} />;
    case 'kite':
      return <Waves className={className} />;
    case 'sports':
      return <Bike className={className} />; // Changed from Bicycle to Bike
    case 'other':
      return <Trophy className={className} />;
    case 'party':
      return <PartyPopper className={className} />;
    case 'game':
      return <Gamepad className={className} />; // Changed from Gamepad2 to Gamepad
    case 'water':
      return <Droplets className={className} />; // Changed from DropletPlus to Droplets
    case 'festival':
      return <Tent className={className} />;
    case 'market':
      return <Users className={className} />;
    case 'event':
      return <Calendar className={className} />;
    case 'location':
      return <MapPin className={className} />;
    default:
      return <Calendar className={className} />;
  }
};
