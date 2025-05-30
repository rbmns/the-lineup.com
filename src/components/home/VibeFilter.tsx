
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryPill } from '@/components/ui/category-pill';

interface VibeFilterProps {
  vibes: string[];
  selectedVibe: string | null;
  onVibeSelect: (vibe: string | null) => void;
}

export const VibeFilter: React.FC<VibeFilterProps> = ({ 
  vibes, 
  selectedVibe, 
  onVibeSelect 
}) => {
  const navigate = useNavigate();

  const handleVibeClick = (vibe: string | null) => {
    onVibeSelect(vibe);
    // Navigate to events page with vibe filter
    if (vibe) {
      navigate(`/events?vibe=${encodeURIComponent(vibe)}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <CategoryPill 
        category="All Vibes" 
        active={selectedVibe === null} 
        noBorder={true} 
        onClick={() => handleVibeClick(null)}
      />
      {vibes.map((vibe) => (
        <CategoryPill 
          key={vibe}
          category={vibe} 
          active={selectedVibe === vibe} 
          noBorder={true} 
          onClick={() => handleVibeClick(vibe)}
        />
      ))}
    </div>
  );
};
