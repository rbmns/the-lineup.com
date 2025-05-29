import React from 'react';
import { brandColors } from '@/components/polymet/brand-colors';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Extended marketing color palette based on the brand colors
export const marketingColors = {
  // Core brand colors
  primary: brandColors.primary,
  secondary: brandColors.secondary,

  // Extended vibrant palette for marketing
  vibrant: {
    ...brandColors.vibrant,
    // Additional vibrant colors
    purple: "#5D3FD3",
    pink: "#F72585",
    amber: "#FF9E00",
    lime: "#84CC16",
    sky: "#00B4D8",
    rose: "#E11D48",
  },

  // Extended nature palette for marketing
  nature: {
    ...brandColors.nature,
    // Additional nature colors
    leaf: "#386641",
    sand: "#E9C46A",
    sky: "#90E0EF",
    sunset: "#E9C46A",
    forest: "#1B4332",
  },

  // Gradient combinations for marketing materials
  gradients: {
    oceanSunset: "bg-gradient-to-r from-[#005F73] to-[#EE6C4D]",
    purpleRose: "bg-gradient-to-r from-[#5D3FD3] to-[#E11D48]",
    seafoamTeal: "bg-gradient-to-r from-[#2A9D8F] to-[#005F73]",
    sunsetAmber: "bg-gradient-to-r from-[#E9C46A] to-[#FF9E00]",
    coralPink: "bg-gradient-to-r from-[#EE6C4D] to-[#F72585]",
    oceanDeep: "bg-gradient-to-r from-[#003944] to-[#005F73]",
    sandyShores: "bg-gradient-to-r from-[#F4E7D3] to-[#E9C46A]",
  },

  // Overlay colors with transparency for images
  overlays: {
    dark: "bg-black/50",
    light: "bg-white/20",
    ocean: "bg-[#005F73]/70",
    coral: "bg-[#EE6C4D]/60",
    seafoam: "bg-[#2A9D8F]/60",
    sand: "bg-[#F4E7D3]/60",
  },

  // Text colors optimized for marketing
  text: {
    onDark: "text-white",
    onLight: "text-[#1C1C1C]",
    accent: "text-[#005F73]",
    highlight: "text-[#EE6C4D]",
    muted: "text-[#5C5C5C]",
    sand: "text-[#F4E7D3]",
  },

  // Background patterns
  patterns: {
    dots: "bg-[radial-gradient(#5C5C5C_1px,transparent_1px)] bg-[length:20px_20px]",
    lines:
      "bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px)] bg-[length:20px_20px]",
    waves:
      "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAwIDIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDEwQzMwIDEwIDMwIDAgNTAgMEM3MCAwIDcwIDEwIDEwMCAxMEMxMzAgMTAgMTMwIDAgMTUwIDBDMTcwIDAgMTcwIDEwIDIwMCAxMFYyMEgwVjEwWiIgZmlsbD0iIzAwNUY3MyIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]",
    beach:
      "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAwIDIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDEwQzMwIDEwIDMwIDAgNTAgMEM3MCAwIDcwIDEwIDEwMCAxMEMxMzAgMTAgMTMwIDAgMTUwIDBDMTcwIDAgMTcwIDEwIDIwMCAxMFYyMEgwVjEwWiIgZmlsbD0iI0U5QzQ2QSIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')]",
  },

  // Social media specific colors
  social: {
    instagram: {
      gradient: "bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#5851DB]",
      text: "text-white",
    },
    facebook: {
      bg: "bg-[#1877F2]",
      text: "text-white",
    },
    twitter: {
      bg: "bg-[#1DA1F2]",
      text: "text-white",
    },
  },

  // Seasonal color themes
  seasonal: {
    summer: {
      primary: "#FF9E00", // Amber
      secondary: "#90E0EF", // Sky blue
      accent: "#FF6B4A", // Coral
    },
    winter: {
      primary: "#003944", // Deep ocean
      secondary: "#F4E7D3", // Sand beige
      accent: "#5D3FD3", // Purple
    },
  },
};

interface ColorSwatchProps {
  color: string;
  name: string;
  hex?: string;
  className?: string;
}

function ColorSwatch({ color, name, hex, className }: ColorSwatchProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="h-16 w-full rounded-md shadow-sm mb-2"
        style={{ backgroundColor: hex || color }}
      />

      <div className="text-sm font-medium">{name}</div>
      {hex && <div className="text-xs text-gray-500">{hex}</div>}
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

interface MarketingColorPaletteProps {
  className?: string;
}

export default function MarketingColorPalette({
  className,
}: MarketingColorPaletteProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Extended Vibrant Colors for Marketing
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(marketingColors.vibrant).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} hex={color} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Extended Nature Colors for Marketing
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(marketingColors.nature).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} hex={color} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Marketing Gradients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(marketingColors.gradients).map(([name, gradient]) => (
            <GradientSwatch key={name} gradient={gradient} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Overlay Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(marketingColors.overlays).map(([name, overlay]) => (
            <div key={name} className="flex flex-col">
              <div className="relative h-16 w-full rounded-md shadow-sm mb-2 overflow-hidden">
                <img
                  src="https://picsum.photos/seed/overlay123/400/200"
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
        <h2 className="text-xl font-semibold mb-4 text-primary">Text Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(marketingColors.text).map(([name, textColor]) => (
            <div key={name} className="flex flex-col">
              <div
                className={cn(
                  "h-16 w-full rounded-md shadow-sm mb-2 flex items-center justify-center font-medium",
                  textColor,
                  name.includes("onDark")
                    ? "bg-[#1C1C1C]"
                    : "bg-white border border-gray-200"
                )}
              >
                Sample Text
              </div>
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-gray-500">{textColor}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Background Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(marketingColors.patterns).map(([name, pattern]) => (
            <PatternSwatch key={name} pattern={pattern} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Social Media Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(marketingColors.social).map(([platform, colors]) => (
            <div key={platform} className="flex flex-col">
              <div
                className={cn(
                  "h-16 w-full rounded-md shadow-sm mb-2 flex items-center justify-center",
                  colors.bg || colors.gradient,
                  colors.text
                )}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </div>
              <div className="text-sm font-medium">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Seasonal Color Themes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(marketingColors.seasonal).map(([season, colors]) => (
            <div key={season} className="space-y-3">
              <h3 className="text-lg font-medium capitalize">{season}</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(colors).map(([colorName, colorValue]) => (
                  <ColorSwatch
                    key={colorName}
                    color={colorValue}
                    name={colorName}
                    hex={colorValue}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Usage Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Post</h3>
            <div
              className={`${marketingColors.gradients.oceanSunset} p-6 rounded-lg text-white`}
            >
              <h4 className="text-xl font-bold mb-2">Discover Local Events</h4>
              <p className="opacity-90">
                Find and join events that match your interests
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Feature Highlight</h3>
            <div
              className={`${marketingColors.gradients.seafoamTeal} p-6 rounded-lg text-white`}
            >
              <h4 className="text-xl font-bold mb-2">Connect with Friends</h4>
              <p className="opacity-90">
                See what events your friends are attending
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Promotion</h3>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src="https://picsum.photos/seed/event456/600/300"
                alt="Event"
                className="w-full h-full object-cover"
              />

              <div
                className={`absolute inset-0 ${marketingColors.overlays.ocean}`}
              ></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h4 className="text-xl font-bold text-white mb-1">
                  Beach Yoga Session
                </h4>
                <p className="text-white/90 text-sm">
                  Saturday, 10:00 AM • Zandvoort Beach
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">App Introduction</h3>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <div
                className={`absolute inset-0 ${marketingColors.patterns.waves} bg-repeat-x bg-bottom`}
              ></div>
              <div
                className={`absolute inset-0 ${marketingColors.gradients.oceanDeep} opacity-90`}
              ></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                <h4 className="text-xl font-bold text-white mb-2">
                  Join thelineup
                </h4>
                <p className="text-white/90">
                  Your community event discovery app
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
