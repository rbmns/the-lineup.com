
import React, { useState } from 'react';
import { CategoryPill } from './category-pill';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export const CategoryPillShowcase = () => {
  // Common event types to showcase
  const eventTypes = [
    'Yoga', 'Festival', 'Wellness', 'Kite', 'Beach', 'Game', 
    'Sports', 'Surf', 'Party', 'Community', 'Water', 
    'Music', 'Food', 'Market'
  ];

  // Interactive demo
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Yoga', 'Beach']);
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };
  
  const selectAll = () => {
    setSelectedCategories([...eventTypes]);
  };
  
  const deselectAll = () => {
    setSelectedCategories([]);
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Category Pills</h2>
        <p className="text-gray-600 mb-6">
          Category pills represent event types and categories throughout the application.
          They have distinct active and inactive states.
        </p>
      </div>

      {/* Display examples of each state */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* All pill */}
            <CategoryPill
              key="all"
              category="All"
              active={selectedCategories.length === eventTypes.length}
              onClick={() => selectedCategories.length === eventTypes.length ? deselectAll() : selectAll()}
              showIcon={true}
              isAll={true}
            />
            
            {/* Regular category pills */}
            {eventTypes.map(category => (
              <CategoryPill
                key={category}
                category={category}
                active={selectedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
                showIcon={true}
              />
            ))}
          </div>
          
          <div className="space-x-2">
            <Button size="sm" onClick={selectAll}>Select All</Button>
            <Button size="sm" variant="outline" onClick={deselectAll}>Deselect All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Default Size Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Pills (Active State)</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} active={true} />
          ))}
        </div>
      </div>
      
      {/* Inactive Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Pills (Inactive State)</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} active={false} />
          ))}
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Pills with Icons</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 7).map(category => (
            <CategoryPill key={category} category={category} showIcon={true} active={true} />
          ))}
        </div>
      </div>

      {/* Small Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Small Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 8).map((category, idx) => (
            <CategoryPill key={category} category={category} size="sm" active={idx < 4} />
          ))}
        </div>
      </div>

      {/* Large Category Pills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Large Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 5).map(category => (
            <CategoryPill key={category} category={category} size="lg" active={true} />
          ))}
        </div>
      </div>
    </section>
  );
};
