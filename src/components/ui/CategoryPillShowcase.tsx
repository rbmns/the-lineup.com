
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';
import { EventTypeIcon } from '@/components/ui/EventTypeIcon';

export const CategoryPillShowcase = () => {
  const demoCategories = ['Music', 'Surf', 'Yoga', 'Beach', 'Food', 'Community'];
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  
  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setIsAllSelected(false);
  };
  
  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...demoCategories]);
    }
    setIsAllSelected(!isAllSelected);
  };

  return (
    <div>
      <h2 className="text-4xl font-bold tracking-tight mb-6">Category Pills</h2>
      
      <div className="space-y-8">
        {/* Regular Category Pills */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">Standard Category Pills</h3>
          <div className="flex flex-wrap gap-2">
            {demoCategories.map(category => (
              <CategoryPill 
                key={category} 
                category={category} 
                active={true}
                onClick={() => handleToggleCategory(category)}
                showIcon={true}
              />
            ))}
          </div>
          
          <div className="mt-4">
            <h4 className="text-xl font-semibold mb-2">Inactive State</h4>
            <div className="flex flex-wrap gap-2">
              {demoCategories.map(category => (
                <CategoryPill 
                  key={category} 
                  category={category} 
                  active={false}
                  onClick={() => handleToggleCategory(category)}
                  showIcon={true}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* All Category Pill */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">All Category Pill</h3>
          <div className="flex gap-2">
            <AllCategoryPill
              active={isAllSelected}
              onClick={handleToggleAll}
              label={isAllSelected ? "Deselect all" : "All"}
              size="default"
            />
          </div>
        </div>
        
        {/* Category Pill Sizes */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">Category Pill Sizes</h3>
          <div className="space-y-4">
            <div>
              <p className="text-base text-muted-foreground mb-2">Extra Small</p>
              <div className="flex gap-2">
                <CategoryPill category="Music" active={true} size="xs" />
                <CategoryPill category="Yoga" active={false} size="xs" />
              </div>
            </div>
            <div>
              <p className="text-base text-muted-foreground mb-2">Small</p>
              <div className="flex gap-2">
                <CategoryPill category="Surf" active={true} size="sm" />
                <CategoryPill category="Beach" active={false} size="sm" />
              </div>
            </div>
            <div>
              <p className="text-base text-muted-foreground mb-2">Default</p>
              <div className="flex gap-2">
                <CategoryPill category="Food" active={true} size="default" />
                <CategoryPill category="Community" active={false} size="default" />
              </div>
            </div>
            <div>
              <p className="text-base text-muted-foreground mb-2">Large</p>
              <div className="flex gap-2">
                <CategoryPill category="Music" active={true} size="lg" />
                <CategoryPill category="Yoga" active={false} size="lg" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Pills with Icons */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">Category Pills with Icons</h3>
          <div className="flex gap-2">
            <CategoryPill category="Music" active={true} showIcon={true} />
            <CategoryPill category="Yoga" active={false} showIcon={true} />
          </div>
        </div>
        
        {/* Event Type Icons */}
        <div>
          <h3 className="text-2xl font-semibold tracking-tight mb-3">Event Type Icons</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center">
              <EventTypeIcon eventType="music" className="h-8 w-8" />
              <span className="mt-1 text-sm">Music</span>
            </div>
            <div className="flex flex-col items-center">
              <EventTypeIcon eventType="yoga" className="h-8 w-8" />
              <span className="mt-1 text-sm">Yoga</span>
            </div>
            <div className="flex flex-col items-center">
              <EventTypeIcon eventType="surf" className="h-8 w-8" />
              <span className="mt-1 text-sm">Surf</span>
            </div>
            <div className="flex flex-col items-center">
              <EventTypeIcon eventType="beach" className="h-8 w-8" />
              <span className="mt-1 text-sm">Beach</span>
            </div>
            <div className="flex flex-col items-center">
              <EventTypeIcon eventType="food" className="h-8 w-8" />
              <span className="mt-1 text-sm">Food</span>
            </div>
            <div className="flex flex-col items-center">
              <EventTypeIcon eventType="community" className="h-8 w-8" />
              <span className="mt-1 text-sm">Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
