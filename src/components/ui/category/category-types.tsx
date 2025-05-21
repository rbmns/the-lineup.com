
// Category types definitions for use throughout the application

export type CategorySizeType = 'xs' | 'sm' | 'default' | 'lg';

export type CategoryStateType = 'active' | 'inactive';

// Define available category types
export type CategoryType = 
  | 'yoga'
  | 'surf'
  | 'beach'
  | 'music'
  | 'food'
  | 'community'
  | 'wellness'
  | 'kite'
  | 'sports'
  | 'party'
  | 'game'
  | 'water'
  | 'festival'
  | 'market'
  | 'other';

// The base interface for category state colors
export interface CategoryStateColors {
  active: string;
  inactive: string;
}

// The category color mapping interface
export interface CategoryColorMap {
  [key: string]: CategoryStateColors;
}
