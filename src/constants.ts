
// Date filter constants
export const DATE_FILTER_OPTIONS = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  THIS_WEEK: 'this week',
  THIS_WEEKEND: 'this weekend',
  NEXT_WEEK: 'next week',
  LATER: 'later'
};

// Updated brand color palette based on Ocean Deep & Sand Beige theme
export const BRAND_COLORS = {
  // Primary colors
  OCEAN_DEEP: '#005F73',
  OCEAN_MEDIUM: '#337D8D', 
  OCEAN_LIGHT: '#669BA7',
  OCEAN_PALE: '#99B9C1',
  OCEAN_HINT: '#E6EEF0',
  
  // Secondary colors
  SAND_BEIGE: '#F4E7D3',
  SAND_LIGHT: '#F9F3E9',
  SAND_PALE: '#FCF9F4',
  SAND_HINT: '#FEFCFA',
  
  // Vibrant accents
  SUNSET: '#FF9933',
  CORAL: '#FF6B4A',
  SEAFOAM: '#66B2B2',
  
  // Neutral colors
  DRIFTWOOD: '#8C8C89',
  DRIFTWOOD_LIGHT: '#A3A3A1',
  DRIFTWOOD_PALE: '#BABAB8',
  DRIFTWOOD_HINT: '#E8E8E7',
  
  // Status colors
  SUCCESS: '#66B2B2',
  WARNING: '#FF9933',
  ERROR: '#FF6B4A',
  INFO: '#005F73'
};

// Legacy nature-inspired color palette for backwards compatibility
export const NATURE_COLORS = {
  // Ocean colors (updated to new brand)
  OCEAN_DEEP: '#005F73',
  OCEAN_MEDIUM: '#337D8D',
  OCEAN_LIGHT: '#669BA7',
  OCEAN_FOAM: '#E6EEF0',
  TEAL: '#66B2B2',
  
  // Warm earth colors
  SAND: '#F4E7D3',
  SUNSET: '#FF9933',
  CORAL: '#FF6B4A',
  AMBER: '#FF9933',
  SANDSTONE: '#F4E7D3',
  
  // Green colors (maintained for compatibility)
  LEAF: '#66CC66',
  LIME: '#99CC33',
  JUNGLE: '#2D6A4F',
  PALM: '#40916C',
  MOSS: '#74C69D',
  
  // Sky colors (updated to brand)
  DAWN: '#F9F3E9',
  DUSK: '#337D8D',
  DAYLIGHT: '#E6EEF0',
  TWILIGHT: '#005F73',
  NIGHT: '#004A5A'
};

// Re-export constants from constants/index.ts
export * from './constants/index';
