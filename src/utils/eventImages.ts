/**
 * Utility for handling event images and fallback images
 */

/**
 * Default event image mapping by type and tags
 */
export const eventImageMap = {
  // Event type specific fallback images
  yoga: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907885/yoga_jftzwz.jpg',
  kite: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907656/kite_gzxprm.jpg',
  surf: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907546/surf_whzonm.jpg',
  market: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876578/shopping_tqeotp.jpg',
  music: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876568/music_ppovn1.jpg',
  beach: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876567/beach_gunp5r.jpg',
  concert: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876521/concert_ithgk3.jpg',
  band: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876517/band_dziaco.jpg',
  food: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745407971/cld-sample-4.jpg',
  
  // Special tag combinations
  'beach-party': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876553/beacrave_iebfd8.jpg',
  'live-band': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876517/band_dziaco.jpg',
  
  // Default fallback
  default: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg'
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

// Event type color mapping
export const eventTypeColors = {
  music: {
    default: {
      bg: 'bg-orange-50',
      text: 'text-orange-500'
    },
    active: {
      bg: 'bg-orange-500',
      text: 'text-orange-50'
    }
  },
  surf: {
    default: {
      bg: 'bg-blue-50',
      text: 'text-blue-500'
    },
    active: {
      bg: 'bg-blue-500',
      text: 'text-blue-50'
    }
  },
  kite: {
    default: {
      bg: 'bg-teal-50',
      text: 'text-teal-500'
    },
    active: {
      bg: 'bg-teal-500',
      text: 'text-teal-50'
    }
  },
  beach: {
    default: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-500'
    },
    active: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-50'
    }
  },
  food: {
    default: {
      bg: 'bg-red-50',
      text: 'text-red-500'
    },
    active: {
      bg: 'bg-red-500',
      text: 'text-red-50'
    }
  },
  yoga: {
    default: {
      bg: 'bg-rose-50',
      text: 'text-rose-500'
    },
    active: {
      bg: 'bg-rose-500',
      text: 'text-rose-50'
    }
  },
  community: {
    default: {
      bg: 'bg-purple-50',
      text: 'text-purple-500'
    },
    active: {
      bg: 'bg-purple-500',
      text: 'text-purple-50'
    }
  },
   wellness: {
    default: {
      bg: 'bg-lime-50',
      text: 'text-lime-500'
    },
    active: {
      bg: 'bg-lime-500',
      text: 'text-lime-50'
    }
  },
  sports: {
    default: {
      bg: 'bg-fuchsia-50',
      text: 'text-fuchsia-500'
    },
    active: {
      bg: 'bg-fuchsia-500',
      text: 'text-fuchsia-50'
    }
  },
  other: {
    default: {
      bg: 'bg-gray-50',
      text: 'text-gray-500'
    },
    active: {
      bg: 'bg-gray-500',
      text: 'text-gray-50'
    }
  }
};
