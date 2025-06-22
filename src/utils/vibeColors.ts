
// Vibe color mapping with unique colors for each vibe
export const VIBE_COLORS = {
  // Core vibes with distinct colors
  party: {
    bg: 'bg-pink-500',
    text: 'text-white',
    hover: 'hover:bg-pink-600',
    border: 'border-pink-500',
    inactive: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
  },
  relaxed: {
    bg: 'bg-blue-500',
    text: 'text-white',
    hover: 'hover:bg-blue-600',
    border: 'border-blue-500',
    inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
  },
  mindful: {
    bg: 'bg-green-500',
    text: 'text-white',
    hover: 'hover:bg-green-600',
    border: 'border-green-500',
    inactive: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
  },
  spiritual: {
    bg: 'bg-purple-500',
    text: 'text-white',
    hover: 'hover:bg-purple-600',
    border: 'border-purple-500',
    inactive: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
  },
  active: {
    bg: 'bg-orange-500',
    text: 'text-white',
    hover: 'hover:bg-orange-600',
    border: 'border-orange-500',
    inactive: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
  },
  social: {
    bg: 'bg-yellow-500',
    text: 'text-white',
    hover: 'hover:bg-yellow-600',
    border: 'border-yellow-500',
    inactive: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
  },
  creative: {
    bg: 'bg-indigo-500',
    text: 'text-white',
    hover: 'hover:bg-indigo-600',
    border: 'border-indigo-500',
    inactive: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
  },
  adventure: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    hover: 'hover:bg-emerald-600',
    border: 'border-emerald-500',
    inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
  },
  family: {
    bg: 'bg-rose-500',
    text: 'text-white',
    hover: 'hover:bg-rose-600',
    border: 'border-rose-500',
    inactive: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
  },
  chill: {
    bg: 'bg-cyan-500',
    text: 'text-white',
    hover: 'hover:bg-cyan-600',
    border: 'border-cyan-500',
    inactive: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
  },
  wellness: {
    bg: 'bg-teal-500',
    text: 'text-white',
    hover: 'hover:bg-teal-600',
    border: 'border-teal-500',
    inactive: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
  },
  // Default for unknown vibes
  general: {
    bg: 'bg-gray-500',
    text: 'text-white',
    hover: 'hover:bg-gray-600',
    border: 'border-gray-500',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
  }
} as const;

export type VibeType = keyof typeof VIBE_COLORS;

export const getVibeColors = (vibe: string): typeof VIBE_COLORS[VibeType] => {
  const normalizedVibe = vibe.toLowerCase().replace(/\s+/g, '') as VibeType;
  return VIBE_COLORS[normalizedVibe] || VIBE_COLORS.general;
};

export const getVibeColorClasses = (vibe: string, isActive: boolean = false, size: 'sm' | 'md' | 'lg' = 'md') => {
  const colors = getVibeColors(vibe);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  if (isActive) {
    return `${colors.bg} ${colors.text} ${colors.hover} ${sizeClasses[size]} rounded-full font-medium transition-colors`;
  } else {
    return `${colors.inactive} ${sizeClasses[size]} rounded-full font-medium transition-colors border`;
  }
};
