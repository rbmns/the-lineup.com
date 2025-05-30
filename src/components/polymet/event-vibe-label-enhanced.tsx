
import React from 'react';

export const vibeOptions = [
  {
    id: 'chill',
    label: 'Chill',
    icon: '😌',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'energetic',
    label: 'Energetic',
    icon: '⚡',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'social',
    label: 'Social',
    icon: '👥',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'romantic',
    label: 'Romantic',
    icon: '💕',
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  {
    id: 'adventurous',
    label: 'Adventurous',
    icon: '🏔️',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'cultural',
    label: 'Cultural',
    icon: '🎭',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: '🎨',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    id: 'mindful',
    label: 'Mindful',
    icon: '🧘',
    color: 'bg-teal-100 text-teal-800 border-teal-200'
  }
];

interface EventVibeLabelProps {
  vibe: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EventVibeLabel: React.FC<EventVibeLabelProps> = ({ vibe, size = 'md' }) => {
  const vibeOption = vibeOptions.find(option => option.id === vibe);
  
  if (!vibeOption) return null;

  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${vibeOption.color} ${sizeClasses[size]}`}>
      <span>{vibeOption.icon}</span>
      <span>{vibeOption.label}</span>
    </span>
  );
};
