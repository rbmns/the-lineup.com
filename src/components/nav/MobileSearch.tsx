
import React from 'react';
import { NavbarSearch } from './NavbarSearch';
import { cn } from '@/lib/utils';

interface MobileSearchProps {
  showMobileSearch: boolean;
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
  showMobileSearch
}) => {
  if (!showMobileSearch) return null;

  return (
    <div className="h-14 px-4 py-2 bg-white flex items-center border-t border-gray-200">
      <NavbarSearch />
    </div>
  );
};
