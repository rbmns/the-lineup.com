
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandLogoProps {
  className?: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export const BrandLogo = React.forwardRef<HTMLDivElement, BrandLogoProps>(
  ({ className = '', onMenuClick, showMenu = false }, ref) => {
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
        <Link to="/home" className="flex items-center gap-2 group transition-all duration-300">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/5fe11e41-bcfb-44e1-b1bb-03f5c6fd9df1.png" 
              alt="the lineup logo" 
              className="h-8 w-auto group-hover:scale-105 transition-transform bg-transparent" 
            />
            <span className="font-inter text-xl font-normal tracking-tight lowercase flex items-center ml-2 group-hover:text-primary transition-colors">
              thelineup
            </span>
          </div>
        </Link>
      </div>
    );
  }
);

BrandLogo.displayName = "BrandLogo";
