
import React from 'react';
import { CategoryPill, AllCategoryPill } from './category-pill';

export const CategoryPillShowcase = () => {
  const eventTypes = [
    'Festival', 'Wellness', 'Kite', 'Beach', 'Game', 
    'Other', 'Sports', 'Surf', 'Party', 'Community', 
    'Water', 'Music', 'Food', 'Market', 'Yoga'
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Event Category Pills</h2>
        <p className="text-gray-600 mb-6">
          Event category pills use our nature-inspired color palette to represent different event types throughout the application.
        </p>
      </div>

      {/* Active vs Inactive Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill active={true} />
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} active={true} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Inactive Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill active={false} />
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} active={false} />
          ))}
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Pills with Icons</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} showIcon={true} active={true} />
          ))}
        </div>
      </div>

      {/* Small Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Small Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill size="sm" active={true} />
          {eventTypes.slice(0, 8).map(category => (
            <CategoryPill key={category} category={category} size="sm" active={true} />
          ))}
        </div>
      </div>

      {/* Large Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Large Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill size="lg" active={true} />
          {eventTypes.slice(0, 6).map(category => (
            <CategoryPill key={category} category={category} size="lg" active={true} />
          ))}
        </div>
      </div>

      {/* Interactive Demonstration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Interactive Category Pills</h3>
        <p className="text-sm text-gray-500 mb-2">Click on a pill to see an alert demonstration</p>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill onClick={() => alert(`Clicked on All`)} active={true} />
          {eventTypes.slice(0, 5).map(category => (
            <CategoryPill 
              key={category} 
              category={category} 
              onClick={() => alert(`Clicked on ${category}`)} 
              active={Math.random() > 0.5} // Randomly show some as active for demonstration
              showIcon={true}
            />
          ))}
        </div>
      </div>
      
      {/* Category Pills by Theme */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Category Pills by Theme</h3>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Ocean Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Kite" active={true} showIcon={true} />
            <CategoryPill category="Surf" active={true} showIcon={true} />
            <CategoryPill category="Water" active={true} showIcon={true} />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Earth Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Beach" active={true} showIcon={true} />
            <CategoryPill category="Market" active={true} showIcon={true} />
            <CategoryPill category="Food" active={true} showIcon={true} />
            <CategoryPill category="Festival" active={true} showIcon={true} />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Forest Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Yoga" active={true} showIcon={true} />
            <CategoryPill category="Wellness" active={true} showIcon={true} />
            <CategoryPill category="Sports" active={true} showIcon={true} />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Sky Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Music" active={true} showIcon={true} />
            <CategoryPill category="Community" active={true} showIcon={true} />
            <CategoryPill category="Party" active={true} showIcon={true} />
            <CategoryPill category="Game" active={true} showIcon={true} />
          </div>
        </div>
      </div>
    </section>
  );
};
