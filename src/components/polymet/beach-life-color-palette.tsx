import { cn } from "@/lib/utils";
import { brandColors } from "@/polymet/components/brand-colors";

// Beach life inspired color palette that extends the brand colors
export const beachLifeColors = {
  // Primary colors - lighter and more vibrant
  primary: {
    DEFAULT: "#0891B2", // Bright teal blue
    dark: "#0E7490", // Deeper teal
    light: "#22D3EE", // Light cyan
    ultraLight: "#ECFEFF", // Almost white cyan
  },

  // Secondary colors - warm and sandy
  secondary: {
    DEFAULT: "#F59E0B", // Warm amber
    dark: "#D97706", // Deep amber
    light: "#FCD34D", // Light yellow
    ultraLight: "#FFFBEB", // Almost white yellow
  },

  // Accent colors - vibrant and energetic
  accent: {
    coral: "#F43F5E", // Vibrant coral
    turquoise: "#06B6D4", // Bright turquoise
    lime: "#84CC16", // Fresh lime
    purple: "#8B5CF6", // Soft purple
    pink: "#EC4899", // Energetic pink
  },

  // Nature inspired colors - beach, ocean, sunset
  nature: {
    sand: "#FBBF24", // Sandy gold
    ocean: "#0EA5E9", // Ocean blue
    sunset: "#FB7185", // Sunset pink
    leaf: "#4ADE80", // Palm leaf green
    sky: "#38BDF8", // Sky blue
  },

  // Gradient combinations for vibrant backgrounds
  gradients: {
    sunrise: "bg-gradient-to-r from-[#FB7185] to-[#F59E0B]",
    ocean: "bg-gradient-to-r from-[#0891B2] to-[#22D3EE]",
    tropical: "bg-gradient-to-r from-[#06B6D4] to-[#4ADE80]",
    sunset: "bg-gradient-to-r from-[#F43F5E] to-[#8B5CF6]",
    beach: "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]",
  },

  // Background patterns with beach themes
  patterns: {
    waves:
      "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAwIDIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDEwQzMwIDEwIDMwIDAgNTAgMEM3MCAwIDcwIDEwIDEwMCAxMEMxMzAgMTAgMTMwIDAgMTUwIDBDMTcwIDAgMTcwIDEwIDIwMCAxMFYyMEgwVjEwWiIgZmlsbD0iIzIyRDNFRSIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')]",
    dots: "bg-[radial-gradient(#22D3EE_1px,transparent_1px)] bg-[length:20px_20px]",
    palms:
      "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBDMzAgMTAgMjAgMzAgMTAgMzBDMCAzMCAwIDIwIDAgMjBDMCAyMCAxMCAxMCAzMCAxMFoiIGZpbGw9IiM0QURFODAiIGZpbGwtb3BhY2l0eT0iMC4xIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSwgMzAsIDMwKSIvPjwvc3ZnPg==')]",
  },

  // UI state colors - more vibrant
  status: {
    success: "#10B981", // Emerald green
    warning: "#F59E0B", // Amber
    error: "#EF4444", // Red
    info: "#3B82F6", // Blue
  },

  // Text colors
  text: {
    dark: "#0F172A", // Very dark blue
    medium: "#475569", // Slate
    light: "#94A3B8", // Light slate
    white: "#FFFFFF", // White
    onDark: "#FFFFFF", // White for dark backgrounds
  },
};

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

interface BeachLifeColorPaletteProps {
  className?: string;
}

export default function BeachLifeColorPalette({
  className,
}: BeachLifeColorPaletteProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Primary Colors - Ocean Inspired
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(beachLifeColors.primary).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Secondary Colors - Sandy Warmth
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(beachLifeColors.secondary).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Accent Colors - Vibrant Energy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(beachLifeColors.accent).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Nature Colors - Beach Life
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(beachLifeColors.nature).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Vibrant Gradients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(beachLifeColors.gradients).map(([name, gradient]) => (
            <GradientSwatch key={name} gradient={gradient} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          Beach Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(beachLifeColors.patterns).map(([name, pattern]) => (
            <PatternSwatch key={name} pattern={pattern} name={name} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">
          UI Status Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(beachLifeColors.status).map(([name, color]) => (
            <ColorSwatch key={name} color={color} name={name} />
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-primary-dark">
          Example Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Beach Yoga Event
            </h3>
            <div
              className={`${beachLifeColors.gradients.ocean} p-6 rounded-lg`}
            >
              <h4 className="text-xl font-bold mb-2 text-white">
                Sunset Beach Yoga
              </h4>
              <p className="text-white/90">
                Join us for a relaxing yoga session as the sun sets over the
                ocean
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Yoga
                </span>
                <span className="text-white/90 text-sm">
                  Fri, June 24 • 18:30
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Surf Competition
            </h3>
            <div
              className={`${beachLifeColors.gradients.tropical} p-6 rounded-lg`}
            >
              <h4 className="text-xl font-bold mb-2 text-white">
                Summer Surf Challenge
              </h4>
              <p className="text-white/90">
                Test your skills against local surfers in our friendly
                competition
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Surf
                </span>
                <span className="text-white/90 text-sm">
                  Sat, July 15 • 10:00
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Beach Party</h3>
            <div
              className={`${beachLifeColors.gradients.sunset} p-6 rounded-lg`}
            >
              <h4 className="text-xl font-bold mb-2 text-white">
                Sunset Beach Party
              </h4>
              <p className="text-white/90">
                Dance to live music with your feet in the sand as the sun goes
                down
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Music
                </span>
                <span className="text-white/90 text-sm">
                  Sat, July 22 • 19:00
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Beach Market</h3>
            <div
              className={`${beachLifeColors.gradients.beach} p-6 rounded-lg`}
            >
              <h4 className="text-xl font-bold mb-2 text-white">
                Local Artisan Market
              </h4>
              <p className="text-white/90">
                Browse handcrafted goods and local food at our beachside market
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Market
                </span>
                <span className="text-white/90 text-sm">
                  Sun, July 16 • 10:00-16:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
