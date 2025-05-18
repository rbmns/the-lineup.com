
import React from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { CategoryPillShowcase } from "@/components/ui/CategoryPillShowcase"

export default function DesignSystem() {
  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Design System</h1>
      
      {/* Typography section based on brand guidelines */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Typography</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Headings</h3>
            <div className="space-y-4 border-l-4 border-gray-200 pl-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Display</span>
                <p className="text-5xl md:text-6xl font-bold tracking-tight">Display Heading</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">H1</span>
                <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">H2</span>
                <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">H3</span>
                <h3 className="text-2xl font-semibold">Heading 3</h3>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">H4</span>
                <h4 className="text-xl font-medium">Heading 4</h4>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">H5</span>
                <h5 className="text-lg font-medium">Heading 5</h5>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-4">Body Text</h3>
            <div className="space-y-4 border-l-4 border-gray-200 pl-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Lead Paragraph</span>
                <p className="text-xl text-muted-foreground leading-relaxed">This is a lead paragraph that introduces the main content. It should be engaging and informative.</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Body</span>
                <p className="text-base leading-7">This is the standard body text used for the main content. It should be easily readable with good line height.</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Small</span>
                <p className="text-sm text-muted-foreground">This smaller text is used for less important information or notes.</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Quote</span>
                <blockquote className="text-lg italic border-l-4 border-primary pl-4 py-2">This is a quotation or a highlighted piece of text that stands out from the rest of the content.</blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Color Palette Section */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Nature-Inspired Color Palette</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ocean Theme */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium mb-3">Ocean Theme</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-ocean-deep"></div>
              <div>
                <p className="font-medium">Ocean Deep</p>
                <p className="text-sm text-gray-500">#005F73</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-ocean-medium"></div>
              <div>
                <p className="font-medium">Ocean Medium</p>
                <p className="text-sm text-gray-500">#0099CC</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-ocean-light"></div>
              <div>
                <p className="font-medium">Ocean Light</p>
                <p className="text-sm text-gray-500">#94D2BD</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-ocean-foam"></div>
              <div>
                <p className="font-medium">Ocean Foam</p>
                <p className="text-sm text-gray-500">#E9F5F5</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-teal"></div>
              <div>
                <p className="font-medium">Teal</p>
                <p className="text-sm text-gray-500">#00CCCC</p>
              </div>
            </div>
          </div>
          
          {/* Earth Theme */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium mb-3">Earth Theme</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-sand"></div>
              <div>
                <p className="font-medium">Sand</p>
                <p className="text-sm text-gray-500">#FFCC99</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-sunset"></div>
              <div>
                <p className="font-medium">Sunset</p>
                <p className="text-sm text-gray-500">#FF9933</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-coral"></div>
              <div>
                <p className="font-medium">Coral</p>
                <p className="text-sm text-gray-500">#FF6666</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-amber"></div>
              <div>
                <p className="font-medium">Amber</p>
                <p className="text-sm text-gray-500">#EE9B00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-sandstone"></div>
              <div>
                <p className="font-medium">Sandstone</p>
                <p className="text-sm text-gray-500">#CA6702</p>
              </div>
            </div>
          </div>
          
          {/* Forest Theme */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium mb-3">Forest Theme</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-leaf"></div>
              <div>
                <p className="font-medium">Leaf</p>
                <p className="text-sm text-gray-500">#66CC66</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-lime"></div>
              <div>
                <p className="font-medium">Lime</p>
                <p className="text-sm text-gray-500">#99CC33</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-jungle"></div>
              <div>
                <p className="font-medium">Jungle</p>
                <p className="text-sm text-gray-500">#2D6A4F</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-palm"></div>
              <div>
                <p className="font-medium">Palm</p>
                <p className="text-sm text-gray-500">#40916C</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-moss"></div>
              <div>
                <p className="font-medium">Moss</p>
                <p className="text-sm text-gray-500">#74C69D</p>
              </div>
            </div>
          </div>
          
          {/* Sky Theme */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium mb-3">Sky Theme</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-dawn"></div>
              <div>
                <p className="font-medium">Dawn</p>
                <p className="text-sm text-gray-500">#FFADAD</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-dusk"></div>
              <div>
                <p className="font-medium">Dusk</p>
                <p className="text-sm text-gray-500">#9966FF</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-daylight"></div>
              <div>
                <p className="font-medium">Daylight</p>
                <p className="text-sm text-gray-500">#AED9E0</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md bg-twilight"></div>
              <div>
                <p className="font-medium">Twilight</p>
                <p className="text-sm text-gray-500">#5E60CE</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-night"></div>
              <div>
                <p className="font-medium">Night</p>
                <p className="text-sm text-gray-500">#3A0CA3</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add the Category Pills Showcase */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <CategoryPillShowcase />
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button 
            variant="default"
            onClick={() => toast({
              title: "Success",
              description: "Your action was successful!",
            })}
          >
            Success Toast
          </Button>

          <Button 
            variant="destructive"
            onClick={() => toast({
              title: "Error",
              description: "There was an error with your action!",
              variant: "destructive",
            })}
          >
            Error Toast
          </Button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              This is the content of the card.
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Card</CardTitle>
              <CardDescription>With custom styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7">This card demonstrates the use of body text styling from the brand guidelines.</p>
            </CardContent>
            <CardFooter>
              <Button className="bg-ocean-medium hover:bg-ocean-deep">Ocean Button</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Forms</h2>
        <form className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="Enter your password" />
          </div>
          <Button>Submit</Button>
        </form>
      </section>
    </div>
  );
}
