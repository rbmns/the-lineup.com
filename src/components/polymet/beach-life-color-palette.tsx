
import { cn } from "@/lib/utils";

// Beach life inspired color palette
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

export default function BeachLifeColorPalette() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Beach Life Color Palette</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(beachLifeColors.primary).map(([name, color]) => (
          <div key={name} className="text-center">
            <div
              className="h-16 w-full rounded mb-2"
              style={{ backgroundColor: color }}
            />
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-500">{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
