import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryPill } from '@/components/ui/category-pill';

interface VibeFilterProps {
  vibes: string[];
  selectedVibe?: string | null;
  onVibeSelect?: (vibe: string | null) => void;
}

export const VibeFilter: React.FC<VibeFilterProps> = ({ 
  vibes, 
  selectedVibe, 
  onVibeSelect 
}) => {
  // If onVibeSelect is provided, use local state management
  if (onVibeSelect) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <CategoryPill 
          category="All Vibes" 
          active={selectedVibe === null} 
          noBorder={true} 
          onClick={() => onVibeSelect(null)}
        />
        {vibes.map((vibe) => (
          <CategoryPill 
            key={vibe}
            category={vibe} 
            active={selectedVibe === vibe} 
            noBorder={true} 
            onClick={() => onVibeSelect(vibe)}
          />
        ))}
      </div>
    );
  }

  // Otherwise, use navigation to events page with vibe filter
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <Link to="/events">
        <CategoryPill 
          category="All Vibes" 
          active={false} 
          noBorder={true} 
        />
      </Link>
      {vibes.map((vibe) => (
        <Link key={vibe} to={`/events?vibe=${encodeURIComponent(vibe)}`}>
          <CategoryPill 
            category={vibe} 
            active={false} 
            noBorder={true} 
          />
        </Link>
      ))}
    </div>
  );
};
