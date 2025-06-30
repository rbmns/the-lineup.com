
export const designTokens = {
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    DEFAULT: 'rounded-md', // Consistent minimal radius
  },
  spacing: {
    section: 'px-6 py-12',
    card: 'p-6',
    tight: 'p-4',
    generous: 'px-6 py-16',
  },
  typography: {
    display: 'font-display',
    body: 'font-body',
    mono: 'font-mono',
  },
  colors: {
    // Bohemian coastal palette
    sand: 'rgb(248 245 240)',        // Main background - warm sand
    coconut: 'rgb(252 250 247)',     // Card backgrounds - soft coconut
    ivory: 'rgb(250 248 245)',       // Alternate sections - gentle ivory
    sage: 'rgb(218 224 220)',        // Muted accents - coastal sage
    clay: 'rgb(201 181 162)',        // Warm earth tone
    seafoam: 'rgb(162 180 178)',     // Soft sea green
    oceanDeep: 'rgb(0 95 115)',      // Primary brand - deep ocean
    vibrantAqua: 'rgb(144 224 239)', // Accent/hover pop - bright aqua
    driftwood: 'rgb(140 140 137)',   // Neutral gray - weathered wood
    midnight: 'rgb(30 30 30)',       // Primary text
  }
} as const;

export type BorderRadiusToken = keyof typeof designTokens.borderRadius;

export const getBorderRadiusClass = (radius: BorderRadiusToken): string => {
  return designTokens.borderRadius[radius];
};

// Coastal-focused defaults with consistent md radius
export const defaultRadius = {
  button: 'md' as BorderRadiusToken,
  card: 'md' as BorderRadiusToken,
  input: 'md' as BorderRadiusToken,
  categoryPill: 'md' as BorderRadiusToken,  // Rounded but not full
  badge: 'md' as BorderRadiusToken,
} as const;

// New coastal shadows
export const coastalShadows = {
  coastal: '0 2px 8px 0 rgba(0, 95, 115, 0.08)',
  elevated: '0 4px 12px 0 rgba(0, 95, 115, 0.12)',
  navigation: '0 1px 3px 0 rgba(0, 95, 115, 0.1), 0 1px 2px 0 rgba(0, 95, 115, 0.06)',
} as const;
