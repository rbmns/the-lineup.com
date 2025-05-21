
// Category types definitions for use throughout the application

export type CategorySizeType = 'xs' | 'sm' | 'default' | 'lg';

export type CategoryStateType = 'active' | 'inactive';

// The base interface for category state colors
export interface CategoryStateColors {
  active: string;
  inactive: string;
}

// The category color mapping interface
export interface CategoryColorMap {
  [key: string]: CategoryStateColors;
}
