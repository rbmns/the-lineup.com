
import React from 'react';
import { CategoryPill, AllCategoryPill } from '@/components/ui/category-pill';

export const CategoryPillShowcase = () => {
  const demoCategories = ['Concert', 'Conference', 'Workshop', 'Party', 'Networking'];
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
      <h2 className="text-xl font-semibold mb-6">Category Pills</h2>
      
      <div className="space-y-8">
        {/* Regular Category Pills */}
        <div>
          <h3 className="text-lg font-medium mb-3">Standard Category Pills</h3>
          <div className="flex flex-wrap gap-2">
            {demoCategories.map(category => (
              <CategoryPill 
                key={category} 
                category={category} 
                active={selectedCategories.includes(category)}
                onClick={() => handleToggleCategory(category)}
                showIcon={true}
              />
            ))}
          </div>
        </div>
        
        {/* All Category Pill */}
        <div>
          <h3 className="text-lg font-medium mb-3">All Category Pill</h3>
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
          <h3 className="text-lg font-medium mb-3">Category Pill Sizes</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Extra Small</p>
              <div className="flex gap-2">
                <CategoryPill category="Concert" active={true} size="xs" />
                <CategoryPill category="Workshop" active={false} size="xs" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Small</p>
              <div className="flex gap-2">
                <CategoryPill category="Conference" active={true} size="sm" />
                <CategoryPill category="Networking" active={false} size="sm" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Default</p>
              <div className="flex gap-2">
                <CategoryPill category="Party" active={true} size="default" />
                <CategoryPill category="Workshop" active={false} size="default" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Large</p>
              <div className="flex gap-2">
                <CategoryPill category="Conference" active={true} size="lg" />
                <CategoryPill category="Networking" active={false} size="lg" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Pills with Icons */}
        <div>
          <h3 className="text-lg font-medium mb-3">Category Pills with Icons</h3>
          <div className="flex gap-2">
            <CategoryPill category="Concert" active={true} showIcon={true} />
            <CategoryPill category="Workshop" active={false} showIcon={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
