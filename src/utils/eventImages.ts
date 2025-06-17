
import { Event } from "@/types";

const EVENT_FALLBACK_IMAGES = {
  community: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg", // Use default since community.jpg doesn't exist
  music: "https://raw.githubusercontent.com/rbmns/images/main/lineup/music.jpg",
  food: "https://raw.githubusercontent.com/rbmns/images/main/lineup/food.jpg",
  sports: "https://raw.githubusercontent.com/rbmns/images/main/lineup/sports.jpg",
  art: "https://raw.githubusercontent.com/rbmns/images/main/lineup/art.jpg",
  culture: "https://raw.githubusercontent.com/rbmns/images/main/lineup/mills.jpg",
  beach: "https://raw.githubusercontent.com/rbmns/images/main/lineup/beach.jpg",
  surf: "https://raw.githubusercontent.com/rbmns/images/main/lineup/surf.jpg",
  yoga: "https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg",
  market: "https://raw.githubusercontent.com/rbmns/images/main/lineup/shopping.jpg",
  festival: "https://raw.githubusercontent.com/rbmns/images/main/lineup/festival.jpg",
  game: "https://raw.githubusercontent.com/rbmns/images/main/lineup/game.jpg",
  party: "https://raw.githubusercontent.com/rbmns/images/main/lineup/beachparty.jpg",
  kite: "https://raw.githubusercontent.com/rbmns/images/main/lineup/kite.jpg",
  wellness: "https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg", // Map wellness to yoga image
  default: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg",
};

export const DEFAULT_FALLBACK_IMAGE_URL = EVENT_FALLBACK_IMAGES.default;

// Export as DEFAULT_EVENT_IMAGES for compatibility
export const DEFAULT_EVENT_IMAGES = {
  yoga: "https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg",
  surf: "https://raw.githubusercontent.com/rbmns/images/main/lineup/surf.jpg",
  beach: "https://raw.githubusercontent.com/rbmns/images/main/lineup/beach.jpg",
  music: "https://raw.githubusercontent.com/rbmns/images/main/lineup/music.jpg",
  food: "https://raw.githubusercontent.com/rbmns/images/main/lineup/food.jpg",
  workshop: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg",
  other: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg",
};

export const eventTypeColors = {
  yoga: "#8B5CF6",
  surf: "#06B6D4", 
  beach: "#F59E0B",
  music: "#A855F7",
  food: "#EF4444",
  workshop: "#6B7280",
  other: "#6B7280",
};

export const getEventFallbackImage = (category?: string, tags?: string[]): string => {
  const fallbackDefault = EVENT_FALLBACK_IMAGES.default;

  if (!category) {
    console.log("[FallbackLogic] No category provided, using default image:", fallbackDefault);
    return fallbackDefault;
  }
  
  const normalizedCategory = category.toLowerCase().trim();

  let selected: string | undefined = undefined;

  // Direct category match first
  if (EVENT_FALLBACK_IMAGES[normalizedCategory as keyof typeof EVENT_FALLBACK_IMAGES]) {
    selected = EVENT_FALLBACK_IMAGES[normalizedCategory as keyof typeof EVENT_FALLBACK_IMAGES];
    console.log(`[FallbackLogic] Direct match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('yoga') || normalizedCategory.includes('wellness')) {
    selected = EVENT_FALLBACK_IMAGES.yoga;
    console.log(`[FallbackLogic] Yoga/wellness match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('surf')) {
    selected = EVENT_FALLBACK_IMAGES.surf;
    console.log(`[FallbackLogic] Surf match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('beach')) {
    selected = EVENT_FALLBACK_IMAGES.beach;
    console.log(`[FallbackLogic] Beach match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('music') || normalizedCategory.includes('concert')) {
    selected = EVENT_FALLBACK_IMAGES.music;
    console.log(`[FallbackLogic] Music match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('food') || normalizedCategory.includes('restaurant')) {
    selected = EVENT_FALLBACK_IMAGES.food;
    console.log(`[FallbackLogic] Food match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('sport')) {
    selected = EVENT_FALLBACK_IMAGES.sports;
    console.log(`[FallbackLogic] Sports match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('art') || normalizedCategory.includes('culture')) {
    selected = EVENT_FALLBACK_IMAGES.culture;
    console.log(`[FallbackLogic] Art/culture match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('festival')) {
    selected = EVENT_FALLBACK_IMAGES.festival;
    console.log(`[FallbackLogic] Festival match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('game')) {
    selected = EVENT_FALLBACK_IMAGES.game;
    console.log(`[FallbackLogic] Game match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('party')) {
    selected = EVENT_FALLBACK_IMAGES.party;
    console.log(`[FallbackLogic] Party match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('kite')) {
    selected = EVENT_FALLBACK_IMAGES.kite;
    console.log(`[FallbackLogic] Kite match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('community')) {
    selected = EVENT_FALLBACK_IMAGES.community;
    console.log(`[FallbackLogic] Community match for "${normalizedCategory}" -> ${selected}`);
  } else if (normalizedCategory.includes('market')) {
    selected = EVENT_FALLBACK_IMAGES.market;
    console.log(`[FallbackLogic] Market match for "${normalizedCategory}" -> ${selected}`);
  } else {
    selected = fallbackDefault;
    console.log(`[FallbackLogic] No match for "${normalizedCategory}", using default -> ${selected}`);
  }

  // Final debug logging
  console.log(
    `[FallbackLogic] Input category: "${category}" (Normalized: "${normalizedCategory}") -> Resolved Image: "${selected}"`
  );
  
  return selected;
};

export const getEventImage = (event: Event): string => {
  // Check for image_urls array first with improved parsing
  if (event.image_urls) {
    let imageUrl: string | null = null;
    
    // Handle different formats of image_urls
    if (Array.isArray(event.image_urls)) {
      for (const url of event.image_urls) {
        if (typeof url === 'string' && url.trim().length > 0) {
          imageUrl = url;
          break;
        }
      }
    } else if (typeof event.image_urls === 'string') {
      const urlString = event.image_urls;
      const trimmedString = urlString.trim();
      if (trimmedString.startsWith('[') && trimmedString.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmedString);
          if (Array.isArray(parsed)) {
            for (const url of parsed) {
              if (typeof url === 'string' && url.trim().length > 0) {
                imageUrl = url;
                break;
              }
            }
          }
        } catch (e) {
          console.warn(`Failed to parse image_urls JSON: ${trimmedString}`);
        }
      } else if (trimmedString.length > 0) {
        imageUrl = trimmedString;
      }
    }
    
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
  }
  
  // Fall back to event_category-based image
  return getEventFallbackImage(event.event_category);
};

export const getEventImages = (event: Event): string[] => {
  if (event.image_urls && event.image_urls.length > 0) {
    return event.image_urls;
  }
  
  return [getEventImage(event)];
};

export const hasMultipleImages = (event: Event): boolean => {
  return event.image_urls ? event.image_urls.length > 1 : false;
};
