
import React from 'react';
import { CategoryPill } from './category-pill';

export const CategoryPillShowcase = () => {
  const eventTypes = [
    'Yoga', 'Festival', 'Wellness', 'Kite', 'Beach', 'Game', 
    'Other', 'Sports', 'Surf', 'Party', 'Community', 'Water', 
    'Music', 'Food', 'Market'
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Category Pills</h2>
        <p className="text-gray-600 mb-6">
          Category pills represent event types and categories throughout the application.
        </p>
      </div>

      {/* Default Size Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Pills (Default Size)</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} />
          ))}
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Pills with Icons</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} showIcon={true} />
          ))}
        </div>
      </div>

      {/* Small Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Small Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 8).map(category => (
            <CategoryPill key={category} category={category} size="sm" />
          ))}
        </div>
      </div>

      {/* Large Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Large Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 8).map(category => (
            <CategoryPill key={category} category={category} size="lg" />
          ))}
        </div>
      </div>

      {/* Active Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 5).map(category => (
            <CategoryPill key={category} category={category} active={true} />
          ))}
        </div>
      </div>

      {/* Interactive Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Interactive Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 5).map(category => (
            <CategoryPill 
              key={category} 
              category={category} 
              onClick={() => alert(`Clicked on ${category}`)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
