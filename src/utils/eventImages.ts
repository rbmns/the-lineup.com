// Export the eventTypeColors so other files can import it
export const eventTypeColors = {
  all: {
    default: { bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-200' },
    active: { bg: 'bg-black', text: 'text-white', border: 'border-black' },
  },
  surf: {
    default: { bg: 'bg-cyan-500', text: 'text-white', border: 'border-cyan-600' },
    active: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-700' },
  },
  yoga: {
    default: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' },
    active: { bg: 'bg-green-600', text: 'text-white', border: 'border-green-700' },
  },
  beach: {
    default: { bg: 'bg-amber-200', text: 'text-amber-800', border: 'border-amber-300' },
    active: { bg: 'bg-amber-400', text: 'text-amber-900', border: 'border-amber-500' },
  },
  music: {
    default: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    active: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700' },
  },
  food: {
    default: { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600' },
    active: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-700' },
  },
  festival: {
    default: { bg: 'bg-fuchsia-500', text: 'text-white', border: 'border-fuchsia-600' },
    active: { bg: 'bg-fuchsia-600', text: 'text-white', border: 'border-fuchsia-700' },
  },
  workshop: {
    default: { bg: 'bg-gray-200', text: 'text-gray-700', border: 'border-gray-300' },
    active: { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' },
  },
  community: {
    default: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    active: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-700' },
  },
  event: {
    default: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    active: { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-500' },
  },
  location: {
    default: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    active: { bg: 'bg-teal-500', text: 'text-white', border: 'border-teal-500' },
  },
  wellness: {
    default: { bg: 'bg-lime-500', text: 'text-white', border: 'border-lime-600' },
    active: { bg: 'bg-lime-600', text: 'text-white', border: 'border-lime-700' },
  },
  kite: {
    default: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
    active: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
  },
  sports: {
    default: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
    active: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
  },
  party: {
    default: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' },
    active: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' },
  },
  game: {
    default: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' },
    active: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' },
  },
  water: {
    default: { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
    active: { bg: 'bg-sky-600', text: 'text-white', border: 'border-sky-700' },
  },
  market: {
    default: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    active: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-700' },
  },
  other: {
    default: { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' },
    active: { bg: 'bg-gray-600', text: 'text-white', border: 'border-gray-700' },
  }
};

// Updated fallback images using Cloudinary URLs
export const fallbackImages = {
  // Event types
  yoga: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907885/yoga_jftzwz.jpg',
  surf: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907546/surf_whzonm.jpg',
  beach: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876567/beach_gunp5r.jpg',
  music: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876568/music_ppovn1.jpg',
  food: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745407971/cld-sample-4.jpg',
  shopping: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876578/shopping_tqeotp.jpg',
  market: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876578/shopping_tqeotp.jpg',
  kite: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907656/kite_gzxprm.jpg',
  concert: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876521/concert_ithgk3.jpg',
  band: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876517/band_dziaco.jpg',
  'beach party': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876553/beacrave_iebfd8.jpg',
  community: 'https://res.cloudinary.com/dita7stkt/image/upload/v1746879957/Community_axmwox.jpg',
  other: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg', // Explicitly set "other" to use default
  default: 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg'
};

// Tag-based fallback images
export const tagFallbackImages = {
  'beach party': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876553/beacrave_iebfd8.jpg',
  'concert': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876521/concert_ithgk3.jpg',
  'band': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876517/band_dziaco.jpg',
  'live band': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876517/band_dziaco.jpg',
  'surf': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907546/surf_whzonm.jpg',
  'kite': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907656/kite_gzxprm.jpg',
  'beach': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876567/beach_gunp5r.jpg',
  'yoga': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745907885/yoga_jftzwz.jpg',
  'shopping': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876578/shopping_tqeotp.jpg',
  'market': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876578/shopping_tqeotp.jpg',
  'music': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745876568/music_ppovn1.jpg',
  'food': 'https://res.cloudinary.com/dita7stkt/image/upload/v1745407971/cld-sample-4.jpg',
  'community': 'https://res.cloudinary.com/dita7stkt/image/upload/v1746879957/Community_axmwox.jpg'
};

// Priority order for tag matching
export const tagPriorityOrder = [
  'beach party',
  'concert',
  'band',
  'live band',
  'surf',
  'kite',
  'beach',
  'yoga',
  'shopping',
  'market',
  'music',
  'food',
  'community'
];

export const getEventFallbackImage = (eventType: string | undefined, tags?: string[] | undefined): string => {
  // 1. Try to match by event type (case insensitive)
  if (eventType) {
    const lowerEventType = eventType.toLowerCase();
    if (fallbackImages[lowerEventType as keyof typeof fallbackImages]) {
      return fallbackImages[lowerEventType as keyof typeof fallbackImages];
    }
  }
  
  // 2. If no match or no event type, try to match by tags
  if (tags && tags.length > 0) {
    // Convert tags to lowercase for case-insensitive matching
    const lowerTags = tags.map(tag => tag.toLowerCase());
    
    // Check tags in priority order
    for (const priorityTag of tagPriorityOrder) {
      if (lowerTags.some(tag => tag.includes(priorityTag))) {
        return tagFallbackImages[priorityTag as keyof typeof tagFallbackImages];
      }
    }
  }
  
  // 3. If no matches found, return default image
  return fallbackImages.default;
};
