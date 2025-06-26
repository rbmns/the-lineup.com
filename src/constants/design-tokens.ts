
export const designTokens = {
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    DEFAULT: 'rounded-sm', // Default to minimal radius
  },
  spacing: {
    editorial: '2rem 1.5rem',
    generous: '3rem 2rem',
    card: '1.5rem',
    tight: '1rem',
  },
  typography: {
    display: 'font-display text-charcoal',
    body: 'font-body text-charcoal',
    mono: 'font-mono text-overcast',
  },
} as const;

export type BorderRadiusToken = keyof typeof designTokens.borderRadius;

export const getBorderRadiusClass = (radius: BorderRadiusToken): string => {
  return designTokens.borderRadius[radius];
};

// Editorial-focused defaults
export const defaultRadius = {
  button: 'sm' as BorderRadiusToken,
  card: 'sm' as BorderRadiusToken,
  input: 'sm' as BorderRadiusToken,
  categoryPill: 'sm' as BorderRadiusToken,
  badge: 'sm' as BorderRadiusToken,
} as const;
