
import React from 'react';
import { CategoryPill, AllCategoryPill } from './category-pill';

export const CategoryPillShowcase = () => {
  const eventTypes = [
    'Festival', 'Wellness', 'Kite', 'Beach', 'Game', 
    'Other', 'Sports', 'Surf', 'Party', 'Community', 
    'Water', 'Music', 'Food', 'Market', 'Yoga'
  ];

  const handleDemoClick = (category: string) => {
    alert(`Clicked on ${category}`);
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Event Category Pills</h2>
        <p className="text-base leading-7 mb-6">
          Event category pills use our nature-inspired color palette to represent different event types throughout the application.
        </p>
      </div>

      {/* Active vs Inactive Category Pills */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Active Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill active={true} onClick={() => handleDemoClick('All')} />
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} active={true} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Inactive Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill active={false} onClick={() => handleDemoClick('All')} />
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} active={false} />
          ))}
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Category Pills with Icons</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(category => (
            <CategoryPill key={category} category={category} showIcon={true} active={true} />
          ))}
        </div>
      </div>

      {/* Small Category Pills */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Small Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill size="sm" active={true} onClick={() => handleDemoClick('All')} />
          {eventTypes.slice(0, 8).map(category => (
            <CategoryPill key={category} category={category} size="sm" active={true} />
          ))}
        </div>
      </div>

      {/* Large Category Pills */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Large Category Pills</h3>
        <div className="flex flex-wrap gap-2">
          <AllCategoryPill size="lg" active={true} onClick={() => handleDemoClick('All')} />
          {eventTypes.slice(0, 6).map(category => (
            <CategoryPill key={category} category={category} size="lg" active={true} />
          ))}
        </div>
      </div>

      {/* Interactive Demonstration */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-2">Interactive Category Pills</h3>
        <p className="text-sm text-muted-foreground mb-2">Click on a pill to see an alert demonstration</p>
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
        <h3 className="text-2xl font-semibold mb-2">Category Pills by Theme</h3>
        
        <div>
          <h4 className="text-xl font-medium mb-2">Ocean Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Kite" active={true} showIcon={true} />
            <CategoryPill category="Surf" active={true} showIcon={true} />
            <CategoryPill category="Water" active={true} showIcon={true} />
          </div>
        </div>
        
        <div>
          <h4 className="text-xl font-medium mb-2">Earth Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Beach" active={true} showIcon={true} />
            <CategoryPill category="Market" active={true} showIcon={true} />
            <CategoryPill category="Food" active={true} showIcon={true} />
            <CategoryPill category="Festival" active={true} showIcon={true} />
          </div>
        </div>
        
        <div>
          <h4 className="text-xl font-medium mb-2">Forest Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Yoga" active={true} showIcon={true} />
            <CategoryPill category="Wellness" active={true} showIcon={true} />
            <CategoryPill category="Sports" active={true} showIcon={true} />
          </div>
        </div>
        
        <div>
          <h4 className="text-xl font-medium mb-2">Sky Theme</h4>
          <div className="flex flex-wrap gap-2">
            <CategoryPill category="Music" active={true} showIcon={true} />
            <CategoryPill category="Community" active={true} showIcon={true} />
            <CategoryPill category="Party" active={true} showIcon={true} />
            <CategoryPill category="Game" active={true} showIcon={true} />
          </div>
        </div>

        <div>
          <h4 className="text-xl font-medium mb-2">Color Palette Reference</h4>
          <p className="text-sm text-muted-foreground mb-4">The nature-inspired colors used in our category pills:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <div className="h-12 bg-ocean-deep rounded"></div>
              <p className="text-xs">Ocean Deep: #005F73</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-ocean-medium rounded"></div>
              <p className="text-xs">Ocean Medium: #0099CC</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-ocean-light rounded"></div>
              <p className="text-xs">Ocean Light: #94D2BD</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-teal rounded"></div>
              <p className="text-xs">Teal: #00CCCC</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-sand rounded"></div>
              <p className="text-xs">Sand: #FFCC99</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-sunset rounded"></div>
              <p className="text-xs">Sunset: #FF9933</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-coral rounded"></div>
              <p className="text-xs">Coral: #FF6666</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-amber rounded"></div>
              <p className="text-xs">Amber: #EE9B00</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-leaf rounded"></div>
              <p className="text-xs">Leaf: #66CC66</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-lime rounded"></div>
              <p className="text-xs">Lime: #99CC33</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-jungle rounded"></div>
              <p className="text-xs">Jungle: #2D6A4F</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-dusk rounded"></div>
              <p className="text-xs">Dusk: #9966FF</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-twilight rounded"></div>
              <p className="text-xs">Twilight: #5E60CE</p>
            </div>
            <div className="space-y-1">
              <div className="h-12 bg-night rounded"></div>
              <p className="text-xs">Night: #3a0CA3</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
