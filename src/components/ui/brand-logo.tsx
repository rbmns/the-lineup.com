
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandLogoProps {
  className?: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
  showText?: boolean;
}

export const BrandLogo = React.forwardRef<HTMLDivElement, BrandLogoProps>(
  ({ className = '', onMenuClick, showMenu = false, showText = true }, ref) => {
    return (
      <div ref={ref} className={`flex items-center gap-2 ${className}`}>
        {showMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 border hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="flex items-center">
            <span className="text-lg font-medium lowercase text-black">thelineup</span>
          </div>
        </Link>
      </div>
    );
  }
);

BrandLogo.displayName = "BrandLogo";
