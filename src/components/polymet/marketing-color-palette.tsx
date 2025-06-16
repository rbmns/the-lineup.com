import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const marketingColors = {
  primary: {
    '50': '#f0f9ff', '100': '#e0f2fe', '200': '#bae6fd', '300': '#7dd3fc',
    '400': '#38bdf8', '500': '#0ea5e9', '600': '#0284c7', '700': '#0369a1',
    '800': '#075985', '900': '#0c4a6e'
  },
  secondary: {
    '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
    '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155',
    '800': '#1e293b', '900': '#0f172a'
  },
  vibrant: {
    '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4',
    '400': '#f472b6', '500': '#ec4899', '600': '#db2777', '700': '#be185d',
    '800': '#9d174d', '900': '#831843'
  }
};

const ColorSwatch = ({
  colorName,
  hex,
  className,
}: {
  colorName: string;
  hex: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="h-16 rounded-md border"
        style={{ backgroundColor: hex }}
      />
      <div className="mt-2 text-sm font-medium">{colorName}</div>
      <div className="text-xs text-muted-foreground">{hex}</div>
    </div>
  );
};

const ColorPalette = ({
  title,
  colors,
}: {
  title: string;
  colors: { [key: string]: string };
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <ColorSwatch key={key} colorName={key} hex={value} />
        ))}
      </div>
    </div>
  );
};

const MarketingColorPalette: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ColorPalette title="Primary Colors (Cool Blues)" colors={marketingColors.primary} />
          <ColorPalette title="Secondary Colors (Neutral Grays)" colors={marketingColors.secondary} />
          <ColorPalette title="Vibrant Accent (Energetic Pinks)" colors={marketingColors.vibrant} />

          <div className="prose prose-sm max-w-none text-gray-600">
            <h3 className="text-gray-800">Usage Guidelines</h3>
            <ul>
              <li>
                <strong>Primary:</strong> Use for main UI elements like buttons, links, and active states.
              </li>
              <li>
                <strong>Secondary:</strong> Use for backgrounds, borders, and text.
              </li>
              <li>
                <strong>Vibrant:</strong> Use sparingly for call-to-actions or to highlight key information.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingColorPalette;
