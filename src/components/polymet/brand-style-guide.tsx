import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { brandColors } from '@/components/polymet/brand-colors';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/polymet/button';
import { 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon, 
  Zap, 
  Eye,
  Download,
  Share2,
  Heart,
  Star
} from 'lucide-react';
import { typography } from '@/components/polymet/brand-typography';
import { WaveIcon } from '@/components/polymet/wave-icon';

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

      <section className="space-y-6">
        <div>
          <h2 className={typography.h2}>Color Palette</h2>
          <p className={typography.body}>
            Our color palette is designed to be vibrant, accessible, and versatile.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={typography.h3}>Primary Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
              <ColorSwatch color="#0891b2" name="Primary 500" />
              <ColorSwatch color="#0e7490" name="Primary 600" />
              <ColorSwatch color="#164e63" name="Primary 900" />
              <ColorSwatch color="#e0f2fe" name="Primary 100" />
              <ColorSwatch color="#f0f9ff" name="Primary 50" />
            </div>
          </div>

          <div>
            <h3 className={typography.h3}>Secondary Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              <ColorSwatch color="#f59e0b" name="Secondary 500" />
              <ColorSwatch color="#d97706" name="Secondary 600" />
              <ColorSwatch color="#fde68a" name="Secondary 100" />
              <ColorSwatch color="#fef3c7" name="Secondary 50" />
            </div>
          </div>

          <div>
            <h3 className={typography.h3}>Accent Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <ColorSwatch color="#06b6d4" name="Teal" />
              <ColorSwatch color="#f43f5e" name="Coral" />
              <ColorSwatch color="#84cc16" name="Lime" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div>
          <h2 className={typography.h2}>Typography</h2>
          <p className={typography.body}>
            Our typography system is designed for clarity, readability, and hierarchy.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className={typography.display}>Display</h1>
            <div className="text-sm text-muted-foreground">
              Used for hero sections and major headlines
            </div>
          </div>

          <div className="space-y-4">
            <h1 className={typography.h1}>Heading 1</h1>
            <div className="text-sm text-muted-foreground">
              Main page headings
            </div>
          </div>

          <div className="space-y-4">
            <h2 className={typography.h2}>Heading 2</h2>
            <div className="text-sm text-muted-foreground">
              Section headings
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={typography.h3}>Heading 3</h3>
            <div className="text-sm text-muted-foreground">
              Subsection headings
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={typography.h4}>Heading 4</h4>
            <div className="text-sm text-muted-foreground">
              Card titles and smaller sections
            </div>
          </div>

          <div className="space-y-4">
            <p className={typography.lead}>
              Lead paragraph text is used to introduce sections with slightly larger, more prominent text.
            </p>
            <div className="text-sm text-muted-foreground">
              Lead paragraph
            </div>
          </div>

          <div className="space-y-4">
            <p className={typography.body}>
              Body text is used for the main content. It should be easy to read and have good contrast.
              This is an example of body text that might span multiple lines in a paragraph.
            </p>
            <div className="text-sm text-muted-foreground">
              Body text
            </div>
          </div>

          <div className="space-y-4">
            <p className={typography.small}>
              Small text is used for captions, footnotes, and other secondary information.
            </p>
            <div className="text-sm text-muted-foreground">
              Small text
            </div>
          </div>

          <div className="space-y-4">
            <blockquote className={typography.quote}>
              "Design is not just what it looks like and feels like. Design is how it works."
              <footer className="mt-2 text-sm">— Steve Jobs</footer>
            </blockquote>
            <div className="text-sm text-muted-foreground">
              Blockquote
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <div>
          <h2 className={typography.h2}>Components</h2>
          <p className={typography.body}>
            Our core UI components follow consistent patterns and styling.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className={typography.h3}>Buttons</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="lg">Large</Button>
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="icon"><Heart size={16} /></Button>
            </div>
          </div>

          <div>
            <h3 className={typography.h3}>Badges</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          <div>
            <h3 className={typography.h3}>Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is a basic card with header and content.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Cards can contain various elements.</p>
                  <Button>Action</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className={typography.h3}>Icons</h3>
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex flex-col items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xs">Heart</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                <span className="text-xs">Star</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Download className="h-6 w-6 text-primary" />
                <span className="text-xs">Download</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Share2 className="h-6 w-6 text-primary" />
                <span className="text-xs">Share</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <WaveIcon className="h-6 w-6 text-primary" />
                <span className="text-xs">Wave</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StyleGuideCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex flex-col">
      <div 
        className="h-16 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <div className="mt-2 text-sm font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{color}</div>
    </div>
  );
}
