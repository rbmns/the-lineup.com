
import React from 'react';
import { Button } from './button';
import { Plus, Search, ArrowRight } from 'lucide-react';

export const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Variants</h2>
        <p className="text-sm text-gray-600">Demonstrates all available button variants with coastal styling</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default" className="w-full">
            Default
          </Button>
          <Button variant="outline" className="w-full">
            Outline
          </Button>
          <Button variant="secondary" className="w-full">
            Secondary
          </Button>
          <Button variant="accent" className="w-full">
            Accent
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Variants with Default Styling</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <Plus />
            Create Event
          </Button>
          <Button variant="outline">
            <Search />
            Search Events
          </Button>
          <Button variant="secondary">
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
                <li>• Use default variant for primary actions</li>
                <li>• Use outline for secondary actions</li>
                <li>• Use accent for special highlights</li>
                <li>• Keep button sizing consistent within components</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-700 mb-2">✗ Don't</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Mix different button styles randomly</li>
                <li>• Use destructive unless for delete actions</li>
                <li>• Override with conflicting className styles</li>
                <li>• Use ghost variant for primary actions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
