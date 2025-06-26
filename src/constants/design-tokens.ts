
export const designTokens = {
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    DEFAULT: 'rounded-sm', // Default to minimal radius
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
    // Coastal palette
    sand: 'rgb(248 245 240)',      // Main background
    coconut: 'rgb(252 250 247)',   // Card backgrounds
    ivory: 'rgb(250 248 245)',     // Alternate sections
    sage: 'rgb(218 224 220)',      // Accent sections
    clay: 'rgb(201 181 162)',      // Primary actions
    seafoam: 'rgb(162 180 178)',   // Secondary actions
    overcast: 'rgb(106 122 131)',  // Muted text - improved contrast
    charcoal: 'rgb(60 64 67)',     // Legacy text
    midnight: 'rgb(30 30 30)',     // New primary text color
  }
} as const;

export type BorderRadiusToken = keyof typeof designTokens.borderRadius;

export const getBorderRadiusClass = (radius: BorderRadiusToken): string => {
  return designTokens.borderRadius[radius];
};

// Coastal-focused defaults
export const defaultRadius = {
  button: 'sm' as BorderRadiusToken,
  card: 'sm' as BorderRadiusToken,
  input: 'sm' as BorderRadiusToken,
  categoryPill: 'sm' as BorderRadiusToken,
  badge: 'sm' as BorderRadiusToken,
} as const;
