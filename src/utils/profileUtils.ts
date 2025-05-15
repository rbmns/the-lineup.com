
import { Event } from '@/types';
import { fallbackImages } from './eventImages';

export const getEventTypeColor = (eventType: string | null | undefined) => {
  switch (eventType?.toLowerCase()) {
    case 'yoga':
      return 'category-pill-yoga';
    case 'surf':
      return 'category-pill-surf';
    case 'beach':
      return 'category-pill-beach';
    case 'music':
      return 'category-pill-music';
    case 'food':
      return 'category-pill-food';
    case 'workshop':
      return 'category-pill-workshop';
    default:
      return 'category-pill-other';
  }
};

export const getEventTypeIconSvg = (eventType: string): string => {
  switch (eventType.toLowerCase()) {
    case 'yoga':
      return `<svg class="w-4 h-4 text-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5714 15.0036L15.4286 16.9333C13.0533 18.1091 10.9467 18.1091 8.57143 16.9333L9.42857 15.0036C11.1448 15.8916 12.8552 15.8916 14.5714 15.0036Z" fill="currentColor"/>
        <path d="M12 13.2C14.2091 13.2 16 11.4091 16 9.2C16 6.99086 14.2091 5.2 12 5.2C9.79086 5.2 8 6.99086 8 9.2C8 11.4091 9.79086 13.2 12 13.2Z" fill="currentColor"/>
        <path d="M18 8L21 5M18 9V5H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 8L3 5M6 9V5H10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'surf':
      return `<svg class="w-4 h-4 text-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8C18 8 19 5 19 3L14 3C12 4 10.5 5 9 7C7.5 9 7 11 6 13C5 15 3 16 3 19L8 19C12 19 13 15 15 13C17 11 18 11 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'beach':
      return `<svg class="w-4 h-4 text-amber" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C15.3137 12 18 9.31371 18 6H6C6 9.31371 8.68629 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 19L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 22C5 20 5 17 12 17C19 17 19 20 19 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'music':
      return `<svg class="w-4 h-4 text-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 16C19 17.1046 18.1046 18 17 18C15.8954 18 15 17.1046 15 16C15 14.8954 15.8954 14 17 14C18.1046 14 19 14.8954 19 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 19V6L19 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'food':
      return `<svg class="w-4 h-4 text-coral" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15C5 11.134 8.13401 8 12 8C15.866 8 19 11.134 19 15Z" stroke="currentColor" stroke-width="2"/>
        <path d="M16 4C16 5.10457 14.2091 6 12 6C9.79086 6 8 5.10457 8 4C8 2.89543 9.79086 2 12 2C14.2091 2 16 2.89543 16 4Z" stroke="currentColor" stroke-width="2"/>
        <path d="M16 4V15C16 17.2091 14.2091 19 12 19C9.79086 19 8 17.2091 8 15V4" stroke="currentColor" stroke-width="2"/>
      </svg>`;
    case 'workshop':
      return `<svg class="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6.5C12 8.433 10.433 10 8.5 10C6.567 10 5 8.433 5 6.5C5 4.567 6.567 3 8.5 3C10.433 3 12 4.567 12 6.5Z" stroke="currentColor" stroke-width="2"/>
        <path d="M5 18L5 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 18L19 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M5 14L5 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 14L19 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 16L12 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 9L12 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 10C19 8.067 17.433 6.5 15.5 6.5C13.567 6.5 12 8.067 12 10C12 11.933 13.567 13.5 15.5 13.5C17.433 13.5 19 11.933 19 10Z" stroke="currentColor" stroke-width="2"/>
      </svg>`;
    default:
      return `<svg class="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
  }
};

export const getFallbackProfileImage = (status?: string) => {
  // Using local image instead of external placeholder to avoid CSP issues
  return `${fallbackImages.default}`;
};

export const getEventDefaultImage = (eventType: string | null | undefined): string => {
  if (!eventType) return fallbackImages.default;
  const normalizedType = eventType.toLowerCase();
  return fallbackImages[normalizedType as keyof typeof fallbackImages] || fallbackImages.default;
};

export const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.split(/[\s@]+/); // Split by whitespace or @ symbol
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
