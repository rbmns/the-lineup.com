
import React from 'react';
import { Button } from './button';
import { Plus, Search, ArrowRight } from 'lucide-react';

export const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Default Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small Button</Button>
          <Button size="default">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <Plus />
            Create Event
          </Button>
          <Button variant="default">
            Explore Events
            <ArrowRight />
          </Button>
          <Button variant="outline">
            <Search />
            Search Events
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Full Width Button</h2>
        <Button size="lg" className="w-full">Full Width Button</Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Default</Button>
          <Button disabled variant="outline">Disabled Outline</Button>
          <Button disabled variant="ghost">Disabled Ghost</Button>
        </div>
      </div>
    </div>
  );
};
