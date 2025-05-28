
/**
 * Utility for handling event images and fallback images
 */

/**
 * Default event image mapping by type and tags
 */
export const eventImageMap = {
  // Event type specific fallback images
  yoga: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg',
  kite: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/kite.jpg',
  surf: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/surf.jpg',
  market: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/shopping.jpg',
  music: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/music.jpg',
  beach: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/beach.jpg',
  concert: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/concert.jpg',
  band: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/band.jpg',
  food: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/food.jpg',
  party: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/beachparty.jpg',
  sports: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/sports.jpg',
  community: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/community.jpg',
  culture: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/culture.jpg',
  art: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/art.jpg'
  
  // Special tag combinations
  'beach-party': 'https://raw.githubusercontent.com/rbmns/images/main/lineup/beachparty.jpg',
  'live-band': 'https://raw.githubusercontent.com/rbmns/images/main/lineup/band.jpg',
  
  // Default fallback
  default: 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg'
};

/**
 * Get a fallback image for an event based on its type and tags
 */
export const getEventFallbackImage = (eventType: string | undefined, tags?: string[]): string => {
  // Normalize event type to lowercase
  const normalizedType = eventType?.toLowerCase() || '';
  
  // Check for direct type match first
  if (normalizedType && eventImageMap[normalizedType as keyof typeof eventImageMap]) {
    return eventImageMap[normalizedType as keyof typeof eventImageMap];
  }
  
  // If has tags, check for tag-based matches
  if (tags && Array.isArray(tags) && tags.length > 0) {
    // Check for special tag combinations first
    const tagString = tags.join('-').toLowerCase();
    
    // Look for specific tag combinations
    if (tagString.includes('beach') && tagString.includes('party')) {
      return eventImageMap['beach-party'];
    }
    
    if ((tagString.includes('live') && tagString.includes('band')) || 
        tagString.includes('live-band')) {
      return eventImageMap['band'];
    }
    
    // Check individual tags
    for (const tag of tags) {
      const normalizedTag = tag.toLowerCase().trim();
      if (eventImageMap[normalizedTag as keyof typeof eventImageMap]) {
        return eventImageMap[normalizedTag as keyof typeof eventImageMap];
      }
    }
  }
  
  // Return default image if no matches
  return eventImageMap.default;
};

// Event type color mapping with nature-inspired colors
export const eventTypeColors = {
  // Water-themed events
  surf: {
    default: {
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    active: {
      bg: 'bg-blue-600',
      text: 'text-blue-50'
    }
  },
  kite: {
    default: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600'
    },
    active: {
      bg: 'bg-cyan-600',
      text: 'text-cyan-50'
    }
  },
  beach: {
    default: {
      bg: 'bg-amber-50',
      text: 'text-amber-500'
    },
    active: {
      bg: 'bg-amber-500',
      text: 'text-amber-50'
    }
  },
  water: {
    default: {
      bg: 'bg-sky-50',
      text: 'text-sky-600'
    },
    active: {
      bg: 'bg-sky-600',
      text: 'text-sky-50'
    }
  },
  
  // Earth/food themed events
  food: {
    default: {
      bg: 'bg-orange-50',
      text: 'text-orange-600'
    },
    active: {
      bg: 'bg-orange-600',
      text: 'text-orange-50'
    }
  },
  market: {
    default: {
      bg: 'bg-amber-50',
      text: 'text-amber-600'
    },
    active: {
      bg: 'bg-amber-600', 
      text: 'text-amber-50'
    }
  },
  
  // Music/Art themed events
  music: {
    default: {
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    },
    active: {
      bg: 'bg-purple-600',
      text: 'text-purple-50'
    }
  },
  concert: {
    default: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600'
    },
    active: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-50'
    }
  },
  band: {
    default: {
      bg: 'bg-violet-50',
      text: 'text-violet-600'
    },
    active: {
      bg: 'bg-violet-600',
      text: 'text-violet-50'
    }
  },
  
  // Nature/Wellness themed events
  yoga: {
    default: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600'
    },
    active: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-50'
    }
  },
  wellness: {
    default: {
      bg: 'bg-green-50',
      text: 'text-green-600'
    },
    active: {
      bg: 'bg-green-600',
      text: 'text-green-50'
    }
  },
  
  // Community events
  community: {
    default: {
      bg: 'bg-fuchsia-50',
      text: 'text-fuchsia-600'
    },
    active: {
      bg: 'bg-fuchsia-600',
      text: 'text-fuchsia-50'
    }
  },
  
  // Sports events
  sports: {
    default: {
      bg: 'bg-lime-50',
      text: 'text-lime-600'
    },
    active: {
      bg: 'bg-lime-600',
      text: 'text-lime-50'
    }
  },
  
  // Special events
  party: {
    default: {
      bg: 'bg-pink-50',
      text: 'text-pink-600'
    },
    active: {
      bg: 'bg-pink-600',
      text: 'text-pink-50'
    }
  },
  festival: {
    default: {
      bg: 'bg-rose-50',
      text: 'text-rose-600'
    },
    active: {
      bg: 'bg-rose-600',
      text: 'text-rose-50'
    }
  },
  
  // Default/other events
  other: {
    default: {
      bg: 'bg-gray-50',
      text: 'text-gray-600'
    },
    active: {
      bg: 'bg-gray-600',
      text: 'text-gray-50'
    }
  }
};
