
import React from 'react';
import { Button } from './button';
import { Plus, Search, ArrowRight } from 'lucide-react';
import { type BorderRadiusToken } from '@/constants/design-tokens';

export const ButtonShowcase: React.FC = () => {
  const radiusOptions: BorderRadiusToken[] = ['none', 'sm', 'DEFAULT'];
  
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Border Radius Options</h2>
        <p className="text-sm text-gray-600">Demonstrates all available border radius variants for buttons</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {radiusOptions.map((radius) => (
            <div key={radius} className="space-y-2">
              <Button radius={radius} className="w-full">
                {radius}
              </Button>
              <code className="text-xs text-gray-500 block text-center">radius="{radius}"</code>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Variants with Default Radius</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Sizes with Custom Radius</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm" radius="sm">Small</Button>
          <Button size="default" radius="sm">Medium</Button>
          <Button size="lg" radius="sm">Large</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button radius="sm">
            <Plus />
            Create Event
          </Button>
          <Button variant="outline" radius="sm">
            <Search />
            Search Events
          </Button>
          <Button variant="secondary" radius="sm">
            Explore Events
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Usage Guidelines</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-700 mb-2">✓ Do</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Use default radius for most buttons</li>
                <li>• Use "none" for completely square buttons</li>
                <li>• Use "sm" for slightly rounded buttons</li>
                <li>• Keep radius consistent within a component</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-700 mb-2">✗ Don't</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Mix different radius values randomly</li>
                <li>• Override with className rounded-*</li>
                <li>• Use inconsistent radius values</li>
                <li>• Forget to specify radius for consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
