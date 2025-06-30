
export const designTokens = {
  // THE LINEUP COASTAL MINERALS PALETTE
  colors: {
    'pure-white': '#FFFFFF',
    'graphite-grey': '#2C3E50', 
    'mist-grey': '#ECEFF1',
    'ocean-teal': '#00A389',
    'sunrise-ochre': '#E6AA68',
    'carbon-black': '#000000',
  },
  
  // MODERN PRECISION TYPOGRAPHY
  typography: {
    fonts: {
      primary: 'Montserrat', // Headlines, navigation, emphasis
      secondary: 'Lato', // Body text, details
    },
    sizes: {
      display: '4rem', // 64px
      h1: '3rem', // 48px
      h2: '2.25rem', // 36px
      h3: '1.875rem', // 30px
      h4: '1.5rem', // 24px
      bodyBase: '1.125rem', // 18px
      small: '0.875rem', // 14px
    },
  },
  
  // SOPHISTICATED BORDER RADIUS
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm', // Very subtle rounding
    md: 'rounded-md', // Most buttons, cards, inputs
    lg: 'rounded-lg', // Prominent cards, modals
    full: 'rounded-full', // Circular elements
    DEFAULT: 'rounded-md', // Default for consistency
  },
  
  // CLEAN SHADOWS
  shadows: {
    sm: 'shadow-sm', // Very slight elevation
    md: 'shadow-md', // General cards, clean and contained
    lg: 'shadow-lg', // Prominent elevation
  },
  
  // GENEROUS SPACING
  spacing: {
    section: 'py-8 md:py-16', // Section vertical padding
    container: 'px-6 md:px-8', // Container horizontal padding
    card: 'p-6', // Card internal padding
    generous: 'p-8 md:p-12', // Abundant whitespace
    tight: 'p-4', // Compact spacing
  },
  
  // SMOOTH TRANSITIONS
  transitions: {
    default: 'transition-all duration-200 ease-in-out',
    gentle: 'transition-all duration-300 ease-in-out',
    quick: 'transition-all duration-150 ease-in-out',
  },
} as const;

export type BorderRadiusToken = keyof typeof designTokens.borderRadius;
export type ShadowToken = keyof typeof designTokens.shadows;
export type SpacingToken = keyof typeof designTokens.spacing;
export type TransitionToken = keyof typeof designTokens.transitions;

export const getBorderRadiusClass = (radius: BorderRadiusToken): string => {
  return designTokens.borderRadius[radius];
};

export const getShadowClass = (shadow: ShadowToken): string => {
  return designTokens.shadows[shadow];
};

export const getSpacingClass = (spacing: SpacingToken): string => {
  return designTokens.spacing[spacing];
};

export const getTransitionClass = (transition: TransitionToken): string => {
  return designTokens.transitions[transition];
};

// Design system defaults optimized for sophisticated coastal aesthetic
export const defaults = {
  button: {
    radius: 'md' as BorderRadiusToken,
    transition: 'default' as TransitionToken,
  },
  card: {
    radius: 'md' as BorderRadiusToken,
    shadow: 'md' as ShadowToken,
    spacing: 'card' as SpacingToken,
  },
  input: {
    radius: 'md' as BorderRadiusToken,
    transition: 'default' as TransitionToken,
  },
  layout: {
    section: 'section' as SpacingToken,
    container: 'container' as SpacingToken,
  },
} as const;

// Color utility functions for programmatic access
export const getColorValue = (colorName: keyof typeof designTokens.colors): string => {
  return designTokens.colors[colorName];
};

// Typography utility functions
export const getFontSize = (size: keyof typeof designTokens.typography.sizes): string => {
  return designTokens.typography.sizes[size];
};

export const getPrimaryFont = (): string => {
  return designTokens.typography.fonts.primary;
};

export const getSecondaryFont = (): string => {
  return designTokens.typography.fonts.secondary;
};
