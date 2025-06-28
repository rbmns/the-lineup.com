
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClearFiltersButtonProps {
  onClick: () => void;
  hasActiveFilters: boolean;
}

export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  onClick,
  hasActiveFilters
}) => {
  const isMobile = useIsMobile();
  
  if (!hasActiveFilters) return null;

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={onClick}
      className="text-ocean-deep/70 hover:text-ocean-deep hover:bg-coral/10 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-2 py-1 h-8 flex-shrink-0"
    >
      <X className="h-3 w-3" />
      {!isMobile && <span>clear all</span>}
    </Button>
  );
};
