
import React from 'react';
import { ButtonShowcase } from '@/components/ui/ButtonShowcase';
import { CategoryPillShowcase } from '@/components/ui/CategoryPillShowcase';
import { EventRsvpButtonsShowcase } from '@/components/ui/EventRsvpButtonsShowcase';

const DesignShowcase = () => {
  return (
    <div className="container py-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">Design System Showcase</h1>
        <p className="text-gray-600 mb-8">
          This page displays all the components in our design system with their variations.
        </p>
      </div>
      
      <CategoryPillShowcase />
      <ButtonShowcase />
      <EventRsvpButtonsShowcase />
    </div>
  );
};

export default DesignShowcase;
