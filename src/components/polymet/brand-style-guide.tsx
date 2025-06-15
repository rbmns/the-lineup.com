
import React from 'react';
import { typography } from '@/components/polymet/brand-typography';
import { Palette, Type, Layout, Image as ImageIcon, Zap, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { StyleGuideCard } from './style-guide/StyleGuideCard';
import { ColorPaletteGuide } from './style-guide/ColorPaletteGuide';
import { TypographyGuide } from './style-guide/TypographyGuide';
import { ComponentsGuide } from './style-guide/ComponentsGuide';

export default function BrandStyleGuide() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className={typography.h1}>Brand Style Guide</h1>
        <p className={typography.lead}>
          A comprehensive guide to our visual identity and design system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StyleGuideCard
          icon={<Palette className="h-5 w-5" />}
          title="Color Palette"
          description="Our brand colors and how to use them"
        />
        <StyleGuideCard
          icon={<Type className="h-5 w-5" />}
          title="Typography"
          description="Font families, sizes, and styles"
        />
        <StyleGuideCard
          icon={<Layout className="h-5 w-5" />}
          title="Layout & Grid"
          description="Spacing, containers, and responsive design"
        />
        <StyleGuideCard
          icon={<ImageIcon className="h-5 w-5" />}
          title="Imagery"
          description="Photography style, illustrations, and icons"
        />
        <StyleGuideCard
          icon={<Zap className="h-5 w-5" />}
          title="Components"
          description="UI components and patterns"
        />
        <StyleGuideCard
          icon={<Eye className="h-5 w-5" />}
          title="Brand Voice"
          description="Tone, messaging, and communication"
        />
      </div>

      <ColorPaletteGuide />

      <Separator />

      <TypographyGuide />
      
      <Separator />

      <ComponentsGuide />
    </div>
  );
}
