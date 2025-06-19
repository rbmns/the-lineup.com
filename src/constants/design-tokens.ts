
export const designTokens = {
  borderRadius: {
    none: 'rounded-none',
    xs: 'rounded-sm',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
  spacing: {
    xs: '0.125rem', // 2px
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.5rem', // 24px
  },
} as const;

export type BorderRadiusToken = keyof typeof designTokens.borderRadius;

// Utility function to get border radius class
export const getBorderRadiusClass = (radius: BorderRadiusToken): string => {
  return designTokens.borderRadius[radius];
};

// Default radius for different component types
export const defaultRadius = {
  button: 'sm' as BorderRadiusToken,
  card: 'lg' as BorderRadiusToken,
  input: 'md' as BorderRadiusToken,
  categoryPill: 'full' as BorderRadiusToken,
  badge: 'md' as BorderRadiusToken,
} as const;
