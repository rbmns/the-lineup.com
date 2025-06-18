import React from 'react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { EventCategoryIcon } from '@/components/ui/event-category-icon';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, Clock, Search, Plus, Heart, Star } from 'lucide-react';
import AppPageHeader from '@/components/ui/AppPageHeader';

const DesignSystem = () => {
  // All category pills from the image
  const eventCategories = [
    'Festival', 'Wellness', 'Kite', 'Beach', 'Game', 'Other', 
    'Sports', 'Surf', 'Party', 'Yoga', 'Community', 'Water', 
    'Music', 'Food', 'Market', 'Art & Culture'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* --- Design System Instructions Card --- */}
        <div className="mb-6">
          <div className="bg-yellow-50 border-l-4 border-primary p-5 rounded-lg shadow flex flex-col gap-2">
            <h2 className="text-xl font-bold tracking-tight text-primary mb-1">Design System: Single Source of Truth</h2>
            <p className="text-base leading-7 text-gray-700">
              This page documents all design tokens, components, and usage guidelines for this app.
              <br />
              <strong>To change the design system:</strong> Edit <code>src/pages/DesignSystem.tsx</code> for documentation/examples, or update individual UI components in <code>src/components/ui/</code>.<br />
              All designers and developers should reference this page to ensure consistency—this is the <span className="font-semibold text-primary">single source of truth</span> for visual design.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
              <li>Preview changes by visiting <code>/design-system</code> in the app.</li>
              <li>Document all new or updated components here for clarity and review before wider adoption.</li>
              <li>Consult this page before starting new UI work.</li>
            </ul>
          </div>
        </div>
        {/* --- End Design System Instructions Card --- */}

        <div className="mb-8">
          <AppPageHeader>Design System</AppPageHeader>
          <p className="text-xl text-muted-foreground leading-relaxed">The lineup's comprehensive design guidelines and components</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="#typography" className="block text-sm hover:text-blue-600">Typography</a>
                <a href="#colors" className="block text-sm hover:text-blue-600">Colors</a>
                <a href="#buttons" className="block text-sm hover:text-blue-600">Buttons</a>
                <a href="#category-pills" className="block text-sm hover:text-blue-600">Category Pills</a>
                <a href="#forms" className="block text-sm hover:text-blue-600">Forms</a>
                <a href="#cards" className="block text-sm hover:text-blue-600">Cards</a>
                <a href="#icons" className="block text-sm hover:text-blue-600">Icons</a>
                <a href="#spacing" className="block text-sm hover:text-blue-600">Spacing</a>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Typography */}
            <section id="typography" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Consistent text styles across the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Headings</h4>
                    <div className="space-y-3">
                      <div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Display Heading</h1>
                        <code className="text-xs text-gray-500">text-5xl md:text-6xl font-bold tracking-tight</code>
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold tracking-tight">H1 Heading</h2>
                        <code className="text-xs text-gray-500">text-4xl font-bold tracking-tight</code>
                      </div>
                      <div>
                        <h3 className="text-3xl font-semibold tracking-tight">H2 Heading</h3>
                        <code className="text-xs text-gray-500">text-3xl font-semibold tracking-tight</code>
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold">H3 Heading</h4>
                        <code className="text-xs text-gray-500">text-2xl font-semibold</code>
                      </div>
                      <div>
                        <h5 className="text-xl font-medium">H4 Heading</h5>
                        <code className="text-xs text-gray-500">text-xl font-medium</code>
                      </div>
                      <div>
                        <h6 className="text-lg font-medium">H5 Heading</h6>
                        <code className="text-xs text-gray-500">text-lg font-medium</code>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Body Text</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xl text-muted-foreground leading-relaxed">Lead paragraph text for subtitles and descriptions</p>
                        <code className="text-xs text-gray-500">text-xl text-muted-foreground leading-relaxed</code>
                      </div>
                      <div>
                        <p className="text-base leading-7">Regular body text for main content and descriptions</p>
                        <code className="text-xs text-gray-500">text-base leading-7</code>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Small text for metadata and secondary information</p>
                        <code className="text-xs text-gray-500">text-sm text-muted-foreground</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Mobile Scaling</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Page Headers:</strong> text-2xl on mobile, text-4xl on desktop</p>
                      <p><strong>Page Subtitles:</strong> text-base on mobile, text-xl on desktop</p>
                      <p><strong>Card Titles:</strong> text-base on mobile, text-lg on desktop</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Colors */}
            <section id="colors">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Primary color palette and usage guidelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-12 bg-black rounded"></div>
                      <div className="text-sm">
                        <div className="font-medium">Primary</div>
                        <div className="text-gray-500">#121212</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-gray-100 rounded border"></div>
                      <div className="text-sm">
                        <div className="font-medium">Secondary</div>
                        <div className="text-gray-500">#F5F5F5</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-blue-500 rounded"></div>
                      <div className="text-sm">
                        <div className="font-medium">Blue</div>
                        <div className="text-gray-500">#3B82F6</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-green-600 rounded"></div>
                      <div className="text-sm">
                        <div className="font-medium">Success</div>
                        <div className="text-gray-500">#16A34A</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Updated Buttons Section */}
            <section id="buttons">
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>Updated button styles matching the new design system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Button Variants</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="default">Default</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Button Sizes</h4>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon">+</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Disabled State</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button disabled>Default</Button>
                      <Button disabled variant="outline">Outline</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Special States</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">Going</Button>
                      <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-blue-50">Interested</Button>
                      <Button variant="destructive">Remove</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Icon Buttons</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button><Plus className="h-4 w-4 mr-2" />Create</Button>
                      <Button variant="outline"><Search className="h-4 w-4 mr-2" />Search</Button>
                      <Button size="icon"><Heart className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Category Pills */}
            <section id="category-pills">
              <Card>
                <CardHeader>
                  <CardTitle>Category Pills</CardTitle>
                  <CardDescription>Event type and filter indicators - complete set as used across the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">All Event Categories (Active State)</h4>
                    <p className="text-sm text-gray-600 mb-4">These colors are used on event cards to label the event type</p>
                    <div className="flex flex-wrap gap-2">
                      {eventCategories.map((category) => (
                        <CategoryPill
                          key={category}
                          category={category}
                          active={true}
                          showIcon={true}
                          size="default"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Pills (Inactive State)</h4>
                    <p className="text-sm text-gray-600 mb-4">Lighter colors used for unselected filter options</p>
                    <div className="flex flex-wrap gap-2">
                      {eventCategories.slice(0, 8).map((category) => (
                        <CategoryPill
                          key={category}
                          category={category}
                          active={false}
                          showIcon={true}
                          size="default"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Sizes</h4>
                    <div className="flex flex-wrap gap-2 items-center">
                      <CategoryPill category="Music" size="xs" active={true} />
                      <CategoryPill category="Music" size="sm" active={true} />
                      <CategoryPill category="Music" size="default" active={true} />
                      <CategoryPill category="Music" size="lg" active={true} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Usage Guidelines</h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Event Cards:</strong> Always use active state (vibrant colors) to clearly identify event type</p>
                      <p><strong>Filter Systems:</strong> Use inactive state for unselected options, active for selected</p>
                      <p><strong>Icons:</strong> Include icons for better visual recognition and accessibility</p>
                      <p><strong>Consistency:</strong> Same colors and styling across all platforms and contexts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Forms */}
            <section id="forms">
              <Card>
                <CardHeader>
                  <CardTitle>Form Elements</CardTitle>
                  <CardDescription>Input fields and form components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
                      <Input placeholder="Enter text..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Search Input</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="Search..." className="pl-10" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Textarea</label>
                    <Textarea placeholder="Enter description..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cards */}
            <section id="cards">
              <Card>
                <CardHeader>
                  <CardTitle>Card Components</CardTitle>
                  <CardDescription>Different card layouts and styles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Event Card (Mobile Optimized)</h4>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-sm">
                      <div className="flex items-center justify-between mb-3">
                        <CategoryPill category="music" size="sm" active={true} />
                        <Badge variant="secondary">15 going</Badge>
                      </div>
                      <h3 className="font-semibold text-base mb-2">Sample Event Title</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>Sat, May 25</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>20:00</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        <span>Sample Location</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-gray-100">U</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">Username</span>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Going</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Icons */}
            <section id="icons">
              <Card>
                <CardHeader>
                  <CardTitle>Icons</CardTitle>
                  <CardDescription>Common icons and usage patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Calendar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Clock</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span className="text-sm">Search</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Add</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">Favorite</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">Star</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Spacing */}
            <section id="spacing">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing & Layout</CardTitle>
                  <CardDescription>Consistent spacing patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Container Padding</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Mobile:</strong> px-4 (16px)</p>
                      <p><strong>Desktop:</strong> px-6 (24px)</p>
                      <p><strong>Page sections:</strong> py-8 md:py-12</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Card Spacing</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Card padding:</strong> p-4 (16px)</p>
                      <p><strong>Card gap (mobile):</strong> space-y-3 (12px)</p>
                      <p><strong>Card gap (desktop):</strong> gap-6 (24px)</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Element Spacing</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Title to subtitle:</strong> mb-2 (8px)</p>
                      <p><strong>Between sections:</strong> space-y-4 (16px)</p>
                      <p><strong>Icon to text:</strong> mr-1.5 (6px)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem;
