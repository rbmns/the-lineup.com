import React from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { CategoryPill } from '@/components/ui/category-pill';
import { Calendar, MapPin, Plus, ChevronRight, Search, Check, Star, MoveRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';

const DesignSystem = () => {
  return (
    <div className="container py-8 space-y-16 mb-16">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-6">Design System</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          This design system documents the visual elements and components used throughout our platform,
          ensuring consistency and accessibility across all pages.
        </p>
      </div>
      
      {/* Color Palette Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Color Palette</h2>
        <p className="text-base leading-7">
          Our color palette is inspired by nature, using a range of ocean, earth, and sky tones to create
          a calming and intuitive interface.
        </p>
        
        <div className="space-y-8">
          {/* Ocean Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Ocean</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 bg-[#005F73] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Ocean Deep</p>
                <p className="text-xs text-muted-foreground">#005F73</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#0099CC] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Ocean Medium</p>
                <p className="text-xs text-muted-foreground">#0099CC</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#94D2BD] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Ocean Light</p>
                <p className="text-xs text-muted-foreground">#94D2BD</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#E9F5F5] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Ocean Foam</p>
                <p className="text-xs text-muted-foreground">#E9F5F5</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#00CCCC] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Teal</p>
                <p className="text-xs text-muted-foreground">#00CCCC</p>
              </div>
            </div>
          </div>
          
          {/* Earth Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Earth</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 bg-[#FFCC99] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Sand</p>
                <p className="text-xs text-muted-foreground">#FFCC99</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#FF9933] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Sunset</p>
                <p className="text-xs text-muted-foreground">#FF9933</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#FF6666] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Coral</p>
                <p className="text-xs text-muted-foreground">#FF6666</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#EE9B00] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Amber</p>
                <p className="text-xs text-muted-foreground">#EE9B00</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#CA6702] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Sandstone</p>
                <p className="text-xs text-muted-foreground">#CA6702</p>
              </div>
            </div>
          </div>
          
          {/* Green Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Green</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 bg-[#66CC66] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Leaf</p>
                <p className="text-xs text-muted-foreground">#66CC66</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#99CC33] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Lime</p>
                <p className="text-xs text-muted-foreground">#99CC33</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#2D6A4F] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Jungle</p>
                <p className="text-xs text-muted-foreground">#2D6A4F</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#40916C] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Palm</p>
                <p className="text-xs text-muted-foreground">#40916C</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#74C69D] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Moss</p>
                <p className="text-xs text-muted-foreground">#74C69D</p>
              </div>
            </div>
          </div>
          
          {/* Sky Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Sky</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 bg-[#FFADAD] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Dawn</p>
                <p className="text-xs text-muted-foreground">#FFADAD</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#9966FF] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Dusk</p>
                <p className="text-xs text-muted-foreground">#9966FF</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#AED9E0] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Daylight</p>
                <p className="text-xs text-muted-foreground">#AED9E0</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#5E60CE] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Twilight</p>
                <p className="text-xs text-muted-foreground">#5E60CE</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-[#3a0CA3] rounded-md shadow-sm"></div>
                <p className="text-sm font-medium">Night</p>
                <p className="text-xs text-muted-foreground">#3a0CA3</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Typography Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Typography</h2>
        <p className="text-base leading-7">
          Our typeface hierarchy is designed for excellent readability across all devices, with clear distinctions between content types.
        </p>
        
        <div className="space-y-8">
          {/* Headings */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Headings</h3>
            <div className="space-y-4 border rounded-lg p-6 bg-white">
              <div className="space-y-1">
                <p className="text-5xl md:text-6xl font-bold tracking-tight">Display</p>
                <p className="text-sm text-muted-foreground">text-5xl md:text-6xl font-bold tracking-tight</p>
              </div>
              
              <div className="space-y-1 pt-3">
                <p className="text-4xl font-bold tracking-tight">Heading 1</p>
                <p className="text-sm text-muted-foreground">text-4xl font-bold tracking-tight</p>
              </div>
              
              <div className="space-y-1 pt-3">
                <p className="text-3xl font-semibold tracking-tight">Heading 2</p>
                <p className="text-sm text-muted-foreground">text-3xl font-semibold tracking-tight</p>
              </div>
              
              <div className="space-y-1 pt-3">
                <p className="text-2xl font-semibold">Heading 3</p>
                <p className="text-sm text-muted-foreground">text-2xl font-semibold</p>
              </div>
              
              <div className="space-y-1 pt-3">
                <p className="text-xl font-medium">Heading 4</p>
                <p className="text-sm text-muted-foreground">text-xl font-medium</p>
              </div>
              
              <div className="space-y-1 pt-3">
                <p className="text-lg font-medium">Heading 5</p>
                <p className="text-sm text-muted-foreground">text-lg font-medium</p>
              </div>
            </div>
          </div>
          
          {/* Body Text */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Body Text</h3>
            <div className="space-y-6 border rounded-lg p-6 bg-white">
              <div className="space-y-1">
                <p className="text-xl text-muted-foreground leading-relaxed">The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-muted-foreground">Lead Paragraph: text-xl text-muted-foreground leading-relaxed</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-base leading-7">The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-muted-foreground">Body: text-base leading-7</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-muted-foreground">Small: text-sm text-muted-foreground</p>
              </div>
              
              <div className="space-y-1">
                <blockquote className="text-lg italic border-l-4 border-primary pl-4 py-2">
                  The quick brown fox jumps over the lazy dog.
                </blockquote>
                <p className="text-sm text-muted-foreground">Quote: text-lg italic border-l-4 border-primary pl-4 py-2</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Buttons</h2>
        <p className="text-base leading-7">
          Our button system provides a consistent way to trigger actions throughout the interface.
        </p>
        
        <div className="space-y-8">
          {/* Default Buttons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Default Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button>Default Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>
          
          {/* Button Sizes */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Button Sizes</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small Button</Button>
              <Button>Medium Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </div>
          
          {/* Buttons with Icons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Buttons with Icons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
              <Button variant="outline">
                Explore Events <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" /> Search Events
              </Button>
            </div>
          </div>
          
          {/* Full Width Button */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Full Width Button</h3>
            <div className="w-full">
              <Button className="w-full">Full Width Button</Button>
            </div>
          </div>
          
          {/* Disabled Buttons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Disabled Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button disabled>Disabled Default</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
              <Button variant="ghost" disabled>Disabled Ghost</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Pills */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Category Pills</h2>
        <p className="text-base leading-7">
          Category pills help users quickly identify and filter content types.
        </p>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <CategoryPill category="Yoga" size="default" />
            <CategoryPill category="Surf" size="default" />
            <CategoryPill category="Beach" size="default" />
            <CategoryPill category="Market" size="default" />
            <CategoryPill category="Food" size="default" />
            <CategoryPill category="Music" size="default" />
            <CategoryPill category="Concert" size="default" />
          </div>
          
          <h3 className="text-xl font-medium mt-6">With Icons</h3>
          <div className="flex flex-wrap gap-3">
            <CategoryPill category="Yoga" showIcon={true} />
            <CategoryPill category="Surf" showIcon={true} />
            <CategoryPill category="Beach" showIcon={true} />
            <CategoryPill category="Market" showIcon={true} />
          </div>
          
          <h3 className="text-xl font-medium mt-6">Active State</h3>
          <div className="flex flex-wrap gap-3">
            <CategoryPill category="Yoga" active={true} />
            <CategoryPill category="Surf" active={true} />
            <CategoryPill category="Beach" active={true} />
          </div>
          
          <h3 className="text-xl font-medium mt-6">Sizes</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <CategoryPill category="Yoga" size="xs" />
            <CategoryPill category="Surf" size="sm" />
            <CategoryPill category="Beach" size="default" />
            <CategoryPill category="Food" size="lg" />
          </div>
        </div>
      </section>
      
      {/* RSVP Buttons */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">RSVP Buttons</h2>
        <p className="text-base leading-7">
          RSVP buttons allow users to quickly respond to event invitations.
        </p>
        
        <div className="space-y-8">
          {/* Default RSVP Buttons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Default RSVP Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Going
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" /> Interested
                </Button>
              </div>
            </div>
          </div>
          
          {/* RSVP Button with Initial Status */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">RSVP Button with Initial Status</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Going</p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4" /> Going
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" /> Interested
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Interested</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Going
                  </Button>
                  <Button variant="default" size="sm" className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600">
                    <Star className="h-4 w-4" /> Interested
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* RSVP Button Sizes */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">RSVP Button Sizes</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Small</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Going
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" /> Interested
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Medium</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="default" className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Going
                  </Button>
                  <Button variant="outline" size="default" className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" /> Interested
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Large</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="lg" className="flex items-center gap-1.5">
                    <Check className="h-5 w-5" /> Going
                  </Button>
                  <Button variant="outline" size="lg" className="flex items-center gap-1.5">
                    <Star className="h-5 w-5" /> Interested
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Minimal RSVP Buttons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Minimal RSVP Buttons</h3>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full p-0">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full p-0">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Event Card Examples */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Event Card Examples</h2>
        <p className="text-base leading-7">Examples of our event card designs in various formats.</p>
        
        {/* Event Cards Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Skeleton States</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <AspectRatio ratio={16/9} className="bg-gray-100">
                <Skeleton className="h-full w-full" />
              </AspectRatio>
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-3">
                  <Skeleton className="h-8 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;
