
import { EVENT_CATEGORIES, getCategoryColor, isValidCategory } from '@/utils/categorySystem';

// Image treatment configuration based on the style guide
export interface ImageTreatment {
  overlay?: string;
  filter?: string;
  borderRadius?: string;
  aspectRatio?: string;
  gradient?: string;
}

// Category-specific image treatments
const CATEGORY_TREATMENTS: Record<string, ImageTreatment> = {
  festival: {
    overlay: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 107, 107, 0.1))',
    filter: 'saturate(1.2) brightness(1.1)',
    borderRadius: '12px',
    aspectRatio: '16/9'
  },
  wellness: {
    overlay: 'linear-gradient(135deg, rgba(78, 205, 196, 0.3), rgba(78, 205, 196, 0.1))',
    filter: 'sepia(0.1) brightness(1.05)',
    borderRadius: '12px',
    aspectRatio: '4/3'
  },
  beach: {
    overlay: 'linear-gradient(135deg, rgba(247, 220, 111, 0.2), rgba(247, 220, 111, 0.05))',
    filter: 'saturate(1.3) brightness(1.15)',
    borderRadius: '12px',
    aspectRatio: '16/9'
  },
  music: {
    overlay: 'linear-gradient(135deg, rgba(210, 180, 222, 0.3), rgba(210, 180, 222, 0.1))',
    filter: 'contrast(1.1) saturate(1.2)',
    borderRadius: '12px',
    aspectRatio: '1/1'
  },
  sports: {
    overlay: 'linear-gradient(135deg, rgba(88, 214, 141, 0.3), rgba(88, 214, 141, 0.1))',
    filter: 'contrast(1.15) brightness(1.1)',
    borderRadius: '12px',
    aspectRatio: '16/9'
  },
  food: {
    overlay: 'linear-gradient(135deg, rgba(250, 219, 216, 0.3), rgba(250, 219, 216, 0.1))',
    filter: 'saturate(1.4) brightness(1.05)',
    borderRadius: '12px',
    aspectRatio: '4/3'
  },
  art: {
    overlay: 'linear-gradient(135deg, rgba(249, 231, 159, 0.3), rgba(249, 231, 159, 0.1))',
    filter: 'saturate(1.1) brightness(1.05)',
    borderRadius: '12px',
    aspectRatio: '1/1'
  },
  // Default treatment for other categories
  default: {
    overlay: 'linear-gradient(135deg, rgba(149, 165, 166, 0.2), rgba(149, 165, 166, 0.05))',
    filter: 'brightness(1.05)',
    borderRadius: '12px',
    aspectRatio: '16/9'
  }
};

// Fallback images for each category
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
  kite: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
  game: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
  sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  surf: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&h=600&fit=crop',
  party: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
  yoga: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
  community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
  music: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  market: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  art: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=600&fit=crop',
  other: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
};

/**
 * Get the appropriate image treatment for a category
 */
export const getCategoryImageTreatment = (category: string): ImageTreatment => {
  const normalizedCategory = category?.toLowerCase();
  return CATEGORY_TREATMENTS[normalizedCategory] || CATEGORY_TREATMENTS.default;
};

/**
 * Get fallback image for a category
 */
export const getCategoryFallbackImage = (category: string): string => {
  const normalizedCategory = category?.toLowerCase();
  return CATEGORY_FALLBACK_IMAGES[normalizedCategory] || CATEGORY_FALLBACK_IMAGES.other;
};

/**
 * Apply automatic image treatment based on category
 */
export const getProcessedImageUrl = (
  originalUrl: string | undefined, 
  category: string, 
  variant: 'card' | 'hero' | 'thumbnail' = 'card'
): string => {
  // Return fallback if no image provided
  if (!originalUrl) {
    return getCategoryFallbackImage(category);
  }

  // For external images, return as-is (treatments will be applied via CSS)
  return originalUrl;
};

/**
 * Generate CSS styles for image treatment
 */
export const getImageTreatmentStyles = (category: string): React.CSSProperties => {
  const treatment = getCategoryImageTreatment(category);
  
  return {
    filter: treatment.filter || 'none',
    borderRadius: treatment.borderRadius || '0',
    aspectRatio: treatment.aspectRatio || 'auto',
    position: 'relative',
    overflow: 'hidden'
  };
};

/**
 * Generate overlay styles for image treatment
 */
export const getImageOverlayStyles = (category: string): React.CSSProperties => {
  const treatment = getCategoryImageTreatment(category);
  
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: treatment.overlay || 'none',
    pointerEvents: 'none' as const,
    zIndex: 1
  };
};

/**
 * Check if an image URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  } catch {
    return false;
  }
};
