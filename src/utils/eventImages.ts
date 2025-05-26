
/**
 * Utility for handling event images and fallback images
 */

/**
 * Default event image mapping by type and tags
 */
export const eventImageMap = {
  // Event type specific fallback images
  yoga: 'https://github.com/rbmns/the-lineup.com/blob/6c74995d3800980ce374ab2c736ff24225be086b/img/yoga.jpg',
  kite: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/kite.jpg',
  surf: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/surf.jpg',
  market: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/shopping.jpg',
  music: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/music.jpg',
  beach: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/beach.jpg',
  concert: 'https://github.com/rbmns/the-lineup.com/blob/63da302226f6bf3c77b888d29651d362f8129297/img/concert.jpg',
  band: 'https://github.com/rbmns/the-lineup.com/blob/e43b1fae25723e90b8de097117d495e8f93e33d0/img/band.jpg',
  food: 'https://github.com/rbmns/the-lineup.com/blob/63da302226f6bf3c77b888d29651d362f8129297/img/food.jpg',
  party: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/beachparty.jpg',
  community: 'https://github.com/rbmns/the-lineup.com/blob/e43b1fae25723e90b8de097117d495e8f93e33d0/img/Community.jpg',
  
  // Special tag combinations
  'beach-party': 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/beachparty.jpg',
  'live-band': 'https://github.com/rbmns/the-lineup.com/blob/e43b1fae25723e90b8de097117d495e8f93e33d0/img/band.jpg',
  
  // Default fallback
  default: 'https://github.com/rbmns/the-lineup.com/blob/051135f253c03fb98eaf9bce191ff9c786bdff2c/img/default.jpg'
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
