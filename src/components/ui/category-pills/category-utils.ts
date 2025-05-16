
import { ReactElement } from 'react';
import { Music, UtensilsCrossed, Tent, Dumbbell, WaterIcon, Users, Beach, MapIcon, Gamepad2, Yoga } from 'lucide-react';

export type CategoryIconMapping = {
  [key: string]: ReactElement;
};

// Function to map category names to icon components
export const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.FC> = {
    'Music': Music,
    'Food': UtensilsCrossed,
    'Festival': Tent,
    'Sports': Dumbbell,
    'Water': WaterIcon,
    'Community': Users,
    'Beach': Beach,
    'Market': MapIcon,
    'Game': Gamepad2,
    'Yoga': Yoga,
  };
  
  const Icon = iconMap[category] || MapIcon;
  return <Icon className="h-4 w-4" />;
};

// Get category color based on name
export const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    'Music': 'bg-purple-500 hover:bg-purple-600',
    'Food': 'bg-red-500 hover:bg-red-600',
    'Festival': 'bg-yellow-500 hover:bg-yellow-600',
    'Sports': 'bg-green-500 hover:bg-green-600',
    'Water': 'bg-blue-500 hover:bg-blue-600',
    'Community': 'bg-indigo-500 hover:bg-indigo-600',
    'Beach': 'bg-amber-500 hover:bg-amber-600',
    'Market': 'bg-orange-500 hover:bg-orange-600',
    'Game': 'bg-violet-500 hover:bg-violet-600',
    'Yoga': 'bg-pink-500 hover:bg-pink-600',
    'Kite': 'bg-cyan-500 hover:bg-cyan-600',
    'Wellness': 'bg-lime-500 hover:bg-lime-600',
    'Surf': 'bg-sky-500 hover:bg-sky-600',
    'Party': 'bg-rose-500 hover:bg-rose-600',
  };
  
  return colorMap[category] || 'bg-gray-500 hover:bg-gray-600';
};
