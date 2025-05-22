
import React from 'react';
import { Link } from 'react-router-dom';

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
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="flex items-center">
            {showText ? (
              <span className="text-lg font-medium lowercase text-black">thelineup</span>
            ) : (
              <span className="text-lg font-medium lowercase text-black">tl</span>
            )}
          </div>
        </Link>
      </div>
    );
  }
);

BrandLogo.displayName = "BrandLogo";
