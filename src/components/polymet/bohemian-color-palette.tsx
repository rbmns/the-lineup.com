import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

// Bohemian-inspired color palette that balances between dark and vibrant
export const bohemianColors = {
  // Primary colors - earthy neutrals
  primary: {
    DEFAULT: "#2A2A2A", // Deep charcoal (slightly softer than pure black)
    dark: "#1A1A1A", // Almost black
    medium: "#4A4A4A", // Medium charcoal
    light: "#6D6D6D", // Light charcoal
    muted: "#9A9A9A", // Muted gray
  },

  // Secondary colors - warm neutrals
  secondary: {
    DEFAULT: "#F2F0EB", // Warm off-white
    dark: "#E5E1D9", // Warm light beige
    medium: "#D8D2C4", // Medium beige
    light: "#EBE6DD", // Light sand
    muted: "#F7F5F0", // Softest beige
  },

  // Earth tones - bohemian inspired
  earth: {
    terracotta: "#C06D59", // Warm terracotta
    clay: "#A26855", // Muted clay
    sand: "#D7C9B1", // Warm sand
    stone: "#8A8178", // Muted stone
    moss: "#6B7D6A", // Muted moss green
  },

  // Accent colors - muted jewel tones
  accent: {
    teal: "#3A7D7E", // Muted teal
    rust: "#B85C3C", // Earthy rust
    ochre: "#C89F5D", // Muted gold/ochre
    sage: "#7A8C79", // Muted sage green
    indigo: "#4A5483", // Muted indigo
  },

  // Gradient combinations for subtle backgrounds
  gradients: {
    earthy: "bg-gradient-to-r from-[#D7C9B1] to-[#C06D59]/80",
    oceanic: "bg-gradient-to-r from-[#3A7D7E]/90 to-[#4A5483]/80",
    sunset: "bg-gradient-to-r from-[#B85C3C]/90 to-[#C89F5D]/80",
    natural: "bg-gradient-to-r from-[#7A8C79]/90 to-[#D7C9B1]/80",
  },

  // Overlay colors with transparency for images
  overlays: {
    dark: "bg-[#1A1A1A]/60",
    light: "bg-[#F2F0EB]/20",
    terracotta: "bg-[#C06D59]/40",
    teal: "bg-[#3A7D7E]/40",
    indigo: "bg-[#4A5483]/40",
  },

  // Background patterns with bohemian themes
  patterns: {
    dots: "bg-[radial-gradient(#2A2A2A_1px,transparent_1px)] bg-[length:20px_20px]",
    lines:
      "bg-[linear-gradient(to_right,#D8D2C4_1px,transparent_1px)] bg-[length:20px_20px]",
    weave:
      "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDEwdjEwSDB6TTEwIDEwaDEwdjEwSDEweiIgZmlsbD0iI0Q4RDJDNCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]",
  },

  // UI state colors - more muted
  status: {
    success: "#5E8B6F", // Muted green
    warning: "#C89F5D", // Muted gold/ochre
    error: "#B85C3C", // Earthy rust
    info: "#3A7D7E", // Muted teal
  },

  // Text colors
  text: {
    dark: "#2A2A2A", // Deep charcoal
    medium: "#4A4A4A", // Medium charcoal
    light: "#6D6D6D", // Light charcoal
    onDark: "#F2F0EB", // Warm off-white
    accent: "#A26855", // Muted clay
  },
};

// Button variants using class-variance-authority
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-secondary hover:bg-primary-medium focus-visible:ring-primary",
        terracotta:
          "bg-earth-terracotta text-secondary hover:bg-earth-clay focus-visible:ring-earth-terracotta",
        teal: "bg-accent-teal text-secondary hover:bg-accent-teal/90 focus-visible:ring-accent-teal",
        ochre:
          "bg-accent-ochre text-primary hover:bg-accent-ochre/90 focus-visible:ring-accent-ochre",
        outline:
          "border border-primary bg-transparent hover:bg-secondary text-primary",
        ghost: "hover:bg-secondary text-primary hover:text-primary",
        link: "text-accent-teal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

// Badge variants using class-variance-authority
export const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-secondary hover:bg-primary/80",
        terracotta:
          "border-transparent bg-earth-terracotta text-secondary hover:bg-earth-terracotta/80",
        teal: "border-transparent bg-accent-teal text-secondary hover:bg-accent-teal/80",
        ochre:
          "border-transparent bg-accent-ochre text-primary hover:bg-accent-ochre/80",
        outline: "text-primary-medium border-primary-light",
        secondary:
          "border-transparent bg-secondary-medium text-primary hover:bg-secondary-dark",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      rounded: "full",
    },
  }
);

// Card variants using class-variance-authority
export const cardVariants = cva("rounded-lg border shadow-sm", {
  variants: {
    variant: {
      default: "bg-white border-secondary-medium",
      terracotta: "bg-earth-terracotta/10 border-earth-terracotta/20",
      teal: "bg-accent-teal/10 border-accent-teal/20",
      ochre: "bg-accent-ochre/10 border-accent-ochre/20",
      stone: "bg-earth-stone/10 border-earth-stone/20",
    },
    hover: {
      none: "",
      lift: "transition-transform duration-300 hover:-translate-y-1 hover:shadow-md",
      glow: "transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(194,158,119,0.3)]",
      border: "transition-colors duration-300 hover:border-earth-terracotta",
    },
  },
  defaultVariants: {
    variant: "default",
    hover: "none",
  },
});

// Category badge variants for different event types
export const categoryBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      category: {
        yoga: "bg-accent-sage/20 text-accent-sage border border-accent-sage/30",
        surf: "bg-accent-teal/20 text-accent-teal border border-accent-teal/30",
        music:
          "bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30",
        market:
          "bg-accent-ochre/20 text-accent-ochre border border-accent-ochre/30",
        community:
          "bg-earth-moss/20 text-earth-moss border border-earth-moss/30",
        food: "bg-earth-terracotta/20 text-earth-terracotta border border-earth-terracotta/30",
        culture: "bg-earth-clay/20 text-earth-clay border border-earth-clay/30",
        festival:
          "bg-accent-rust/20 text-accent-rust border border-accent-rust/30",
        sport:
          "bg-accent-teal/20 text-accent-teal border border-accent-teal/30",
        art: "bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30",
        wellness:
          "bg-accent-sage/20 text-accent-sage border border-accent-sage/30",
        default:
          "bg-primary-light/20 text-primary-light border border-primary-light/30",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      category: "default",
      rounded: "full",
      size: "md",
    },
  }
);

interface ColorSwatchProps {
  color: string;
  name: string;
  className?: string;
}

function ColorSwatch({ color, name, className }: ColorSwatchProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="h-16 w-full rounded-md shadow-sm mb-2"
        style={{ backgroundColor: color }}
      />

      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-gray-500">{color}</div>
    </div>
  );
}

interface GradientSwatchProps {
  gradient: string;
  name: string;
  className?: string;
}

function GradientSwatch({ gradient, name, className }: GradientSwatchProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("h-16 w-full rounded-md shadow-sm mb-2", gradient)} />

      <div className="text-sm font-medium">{name}</div>
    </div>
  );
}

interface PatternSwatchProps {
  pattern: string;
  name: string;
  className?: string;
}

function PatternSwatch({ pattern, name, className }: PatternSwatchProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("h-16 w-full rounded-md shadow-sm mb-2", pattern)} />

      <div className="text-sm font-medium">{name}</div>
    </div>
  );
}

interface BohemianColorPaletteProps {
  className?: string;
}

export default function BohemianColorPalette({
  className,
}: BohemianColorPaletteProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Primary Colors - Earthy Neutrals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(bohemianColors.primary).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Secondary Colors - Warm Neutrals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(bohemianColors.secondary).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Earth Tones - Bohemian Inspired
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(bohemianColors.earth).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Accent Colors - Muted Jewel Tones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(bohemianColors.accent).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Bohemian Gradients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(bohemianColors.gradients).map(([name, gradient]) => (
            <GradientSwatch key={name} gradient={gradient} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Overlay Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(bohemianColors.overlays).map(([name, overlay]) => (
            <div key={name} className="flex flex-col">
              <div className="relative h-16 w-full rounded-md shadow-sm mb-2 overflow-hidden">
                <img
                  src="https://picsum.photos/seed/bohemian123/400/200"
                  alt="Sample"
                  className="w-full h-full object-cover"
                />

                <div className={cn("absolute inset-0", overlay)}></div>
              </div>
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-gray-500">{overlay}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Background Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(bohemianColors.patterns).map(([name, pattern]) => (
            <PatternSwatch key={name} pattern={pattern} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          UI Status Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(bohemianColors.status).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-secondary-medium">
        <h2 className="text-xl font-semibold mb-6 text-primary-dark">
          Example Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Event Card Example
            </h3>
            <div
              className={cardVariants({ variant: "default", hover: "lift" })}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src="https://picsum.photos/seed/yoga456/800/600"
                  alt="Yoga event"
                  className="w-full h-full object-cover"
                />

                <div className={bohemianColors.overlays.dark}></div>
                <div className="absolute top-4 left-4">
                  <span className={categoryBadgeVariants({ category: "yoga" })}>
                    Yoga
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-primary mb-1">
                  Sunset Beach Yoga
                </h4>
                <p className="text-primary-light text-sm mb-3">
                  Join us for a relaxing yoga session as the sun sets over the
                  ocean
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-medium">
                    Fri, June 24 • 18:30
                  </span>
                  <button
                    className={buttonVariants({
                      variant: "teal",
                      size: "sm",
                      rounded: "full",
                    })}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Community Event Example
            </h3>
            <div
              className={cardVariants({ variant: "default", hover: "lift" })}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src="https://picsum.photos/seed/market789/800/600"
                  alt="Market event"
                  className="w-full h-full object-cover"
                />

                <div className={bohemianColors.overlays.terracotta}></div>
                <div className="absolute top-4 left-4">
                  <span
                    className={categoryBadgeVariants({ category: "market" })}
                  >
                    Market
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-primary mb-1">
                  Local Artisan Market
                </h4>
                <p className="text-primary-light text-sm mb-3">
                  Browse handcrafted goods and local food at our beachside
                  market
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-medium">
                    Sun, July 16 • 10:00-16:00
                  </span>
                  <button
                    className={buttonVariants({
                      variant: "ochre",
                      size: "sm",
                      rounded: "full",
                    })}
                  >
                    Interested
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-secondary-medium">
        <h2 className="text-xl font-semibold mb-6 text-primary-dark">
          UI Components
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary mb-3">
              Button Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className={buttonVariants({ variant: "default" })}>
                Default
              </button>
              <button className={buttonVariants({ variant: "terracotta" })}>
                Terracotta
              </button>
              <button className={buttonVariants({ variant: "teal" })}>
                Teal
              </button>
              <button className={buttonVariants({ variant: "ochre" })}>
                Ochre
              </button>
              <button className={buttonVariants({ variant: "outline" })}>
                Outline
              </button>
              <button className={buttonVariants({ variant: "ghost" })}>
                Ghost
              </button>
              <button className={buttonVariants({ variant: "link" })}>
                Link
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-primary mb-3">
              Badge Variants
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={badgeVariants({ variant: "default" })}>
                Default
              </span>
              <span className={badgeVariants({ variant: "terracotta" })}>
                Terracotta
              </span>
              <span className={badgeVariants({ variant: "teal" })}>Teal</span>
              <span className={badgeVariants({ variant: "ochre" })}>Ochre</span>
              <span className={badgeVariants({ variant: "outline" })}>
                Outline
              </span>
              <span className={badgeVariants({ variant: "secondary" })}>
                Secondary
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-primary mb-3">
              Category Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={categoryBadgeVariants({ category: "yoga" })}>
                Yoga
              </span>
              <span className={categoryBadgeVariants({ category: "surf" })}>
                Surf
              </span>
              <span className={categoryBadgeVariants({ category: "music" })}>
                Music
              </span>
              <span className={categoryBadgeVariants({ category: "market" })}>
                Market
              </span>
              <span
                className={categoryBadgeVariants({ category: "community" })}
              >
                Community
              </span>
              <span className={categoryBadgeVariants({ category: "food" })}>
                Food
              </span>
              <span className={categoryBadgeVariants({ category: "culture" })}>
                Culture
              </span>
              <span className={categoryBadgeVariants({ category: "festival" })}>
                Festival
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
