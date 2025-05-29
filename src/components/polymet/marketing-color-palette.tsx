
import React from 'react';
import { brandColors } from '@/components/polymet/brand-colors';

interface ColorCardProps {
  name: string;
  value: string;
  textColor?: string;
}

const ColorCard: React.FC<ColorCardProps> = ({ name, value, textColor = 'text-white' }) => (
  <div 
    className={`p-4 rounded-lg ${textColor}`}
    style={{ backgroundColor: value }}
  >
    <div className="font-medium">{name}</div>
    <div className="text-sm opacity-90">{value}</div>
  </div>
);

const MarketingColorPalette: React.FC = () => {
  const vibrantColors = brandColors.vibrant || { 500: '#ec4899' };
  const natureColors = brandColors.nature || { 500: '#22c55e' };

  const colorPalettes = {
    vibrant: {
      name: 'Vibrant',
      colors: vibrantColors
    },
    nature: {
      name: 'Nature', 
      colors: natureColors
    }
  };

  const gradientExamples = [
    {
      name: 'Ocean Sunset',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #f59e0b 100%)',
      text: 'text-white'
    },
    {
      name: 'Beach Vibes',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #84cc16 100%)',
      text: 'text-white'
    }
  ];

  const socialMediaColors = [
    { 
      name: 'Instagram Story',
      bg: brandColors.vibrant?.[500] || '#ec4899',
      text: 'text-white' 
    },
    { 
      name: 'Facebook Post',
      bg: brandColors.primary[500],
      text: 'text-white' 
    },
    { 
      name: 'Twitter Header',
      bg: brandColors.nature?.[500] || '#22c55e',
      text: 'text-white' 
    }
  ];

  // Type-safe access to brand colors
  const getPrimaryColorValue = (shade: string): string => {
    return (brandColors.primary as any)[shade] || '#0891b2';
  };

  const getSecondaryColorValue = (shade: string): string => {
    return (brandColors.secondary as any)[shade] || '#f59e0b';
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Marketing Color Palette</h2>
        <p className="text-gray-600 mb-6">
          A comprehensive color system for marketing materials and brand applications.
        </p>
      </div>

      {/* Primary Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Primary Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(brandColors.primary).map(([shade, color]) => (
            <ColorCard
              key={shade}
              name={`Primary ${shade}`}
              value={color}
              textColor={['50', '100'].includes(shade) ? 'text-gray-800' : 'text-white'}
            />
          ))}
        </div>
      </section>

      {/* Secondary Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Secondary Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(brandColors.secondary).map(([shade, color]) => (
            <ColorCard
              key={shade}
              name={`Secondary ${shade}`}
              value={color}
              textColor={['50', '100'].includes(shade) ? 'text-gray-800' : 'text-white'}
            />
          ))}
        </div>
      </section>

      {/* Accent Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Accent Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(brandColors.accent).map(([name, color]) => (
            <ColorCard
              key={name}
              name={`Accent ${name.charAt(0).toUpperCase() + name.slice(1)}`}
              value={color}
            />
          ))}
        </div>
      </section>

      {/* Extended Palette */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Extended Palette</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(colorPalettes).map(([key, palette]) => (
            <div key={key}>
              <h4 className="text-lg font-medium mb-3">{palette.name}</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(palette.colors).map(([shade, color]) => (
                  <ColorCard
                    key={shade}
                    name={shade}
                    value={color}
                    textColor={['50', '100'].includes(shade) ? 'text-gray-800' : 'text-white'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gradient Examples */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Gradient Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradientExamples.map((example, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg ${example.text}`}
              style={{ background: example.gradient }}
            >
              <h4 className="text-lg font-medium">{example.name}</h4>
              <p className="text-sm opacity-90">Perfect for hero sections and CTAs</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Applications */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Social Media Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialMediaColors.map((item, index) => {
            const hasGradient = 'gradient' in item;
            const style = hasGradient 
              ? { background: (item as any).gradient }
              : { backgroundColor: (item as any).bg };
            
            return (
              <div
                key={index}
                className={`p-6 rounded-lg ${item.text}`}
                style={style}
              >
                <h4 className="text-lg font-medium">{item.name}</h4>
                <p className="text-sm opacity-90">Optimized for platform visibility</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Usage Guidelines */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Usage Guidelines</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Do</h4>
              <ul className="space-y-2 text-sm">
                <li>• Use primary colors for main CTAs and navigation</li>
                <li>• Apply secondary colors for highlights and accents</li>
                <li>• Maintain sufficient contrast ratios</li>
                <li>• Use gradients sparingly for hero sections</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-800 mb-3">Don't</h4>
              <ul className="space-y-2 text-sm">
                <li>• Mix too many colors in one design</li>
                <li>• Use light colors on light backgrounds</li>
                <li>• Override brand colors without approval</li>
                <li>• Apply gradients to text or small elements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketingColorPalette;
