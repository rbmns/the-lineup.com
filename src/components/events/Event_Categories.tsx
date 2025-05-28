
import React from 'react';
import { CategoryPill } from '@/components/ui/category-pill';
import { EVENT_CATEGORIES, getCategoryLabel } from '@/utils/categorySystem';
import { cn } from '@/lib/utils';

interface EventCategoriesProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  className?: string;
  variant?: 'pills' | 'badges' | 'filter';
}

export const EventCategories: React.FC<EventCategoriesProps> = ({
  selectedCategories = [],
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  className,
  variant = 'pills'
}) => {
  const allSelected = selectedCategories.length === EVENT_CATEGORIES.length;
  const noneSelected = selectedCategories.length === 0;

  const handleAllClick = () => {
    if (allSelected || selectedCategories.length > 0) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* All Categories option */}
      <CategoryPill
        category="All Categories"
        active={noneSelected}
        onClick={handleAllClick}
        showIcon={false}
        size="default"
        className="border-2"
      />
      
      {/* Individual category pills */}
      {EVENT_CATEGORIES.map((category) => (
        <CategoryPill
          key={category}
          category={getCategoryLabel(category)}
          active={selectedCategories.includes(category)}
          onClick={() => onToggleCategory(category)}
          showIcon={true}
          size="default"
        />
      ))}
    </div>
  );
};

export default EventCategories;
