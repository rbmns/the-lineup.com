
// Unified Category System
// This file contains all standardized categories and vibes

export const EVENT_CATEGORIES = [
  'festival', 'wellness', 'kite', 'beach', 'game', 'other', 
  'sports', 'surf', 'party', 'yoga', 'community', 'music', 
  'food', 'market', 'art'
] as const;

export const EVENT_VIBES = [
  'party', 'chill', 'wellness', 'active', 'social', 'creative'
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];
export type EventVibe = typeof EVENT_VIBES[number];

// Category display names and metadata
export const CATEGORY_CONFIG = {
  festival: { label: 'Festival', color: '#FF6B6B', emoji: '🎪' },
  wellness: { label: 'Wellness', color: '#4ECDC4', emoji: '🧘' },
  kite: { label: 'Kite', color: '#45B7D1', emoji: '🪁' },
  beach: { label: 'Beach', color: '#F7DC6F', emoji: '🏖️' },
  game: { label: 'Game', color: '#BB8FCE', emoji: '🎮' },
  other: { label: 'Other', color: '#95A5A6', emoji: '📋' },
  sports: { label: 'Sports', color: '#58D68D', emoji: '⚽' },
  surf: { label: 'Surf', color: '#5DADE2', emoji: '🏄' },
  party: { label: 'Party', color: '#F1948A', emoji: '🎉' },
  yoga: { label: 'Yoga', color: '#85C1E9', emoji: '🧘‍♀️' },
  community: { label: 'Community', color: '#F8C471', emoji: '🤝' },
  music: { label: 'Music', color: '#D2B4DE', emoji: '🎵' },
  food: { label: 'Food', color: '#FADBD8', emoji: '🍽️' },
  market: { label: 'Market', color: '#ABEBC6', emoji: '🛒' },
  art: { label: 'Art', color: '#F9E79F', emoji: '🎨' }
} as const;

// Vibe display names and metadata
export const VIBE_CONFIG = {
  party: { label: 'Party', color: '#FF6B6B', pattern: 'sparkle' },
  chill: { label: 'Chill', color: '#4ECDC4', pattern: 'wave' },
  wellness: { label: 'Wellness', color: '#45B7D1', pattern: 'zen' },
  active: { label: 'Active', color: '#58D68D', pattern: 'lightning' },
  social: { label: 'Social', color: '#F7DC6F', pattern: 'people' },
  creative: { label: 'Creative', color: '#BB8FCE', pattern: 'art' }
} as const;

// Helper functions
export const getCategoryLabel = (category: string): string => {
  return CATEGORY_CONFIG[category as EventCategory]?.label || category;
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_CONFIG[category as EventCategory]?.color || '#95A5A6';
};

export const getVibeLabel = (vibe: string): string => {
  return VIBE_CONFIG[vibe as EventVibe]?.label || vibe;
};

export const getVibeColor = (vibe: string): string => {
  return VIBE_CONFIG[vibe as EventVibe]?.color || '#95A5A6';
};

export const isValidCategory = (category: string): category is EventCategory => {
  return EVENT_CATEGORIES.includes(category as EventCategory);
};

export const isValidVibe = (vibe: string): vibe is EventVibe => {
  return EVENT_VIBES.includes(vibe as EventVibe);
};
