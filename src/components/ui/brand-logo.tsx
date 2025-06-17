
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
      <div ref={ref} className={`flex items-center ${className}`}>
        <Link to="/" className="flex items-center group transition-all duration-300">
          <div className="flex items-center">
            {showText && (
              <span className="text-xl md:text-2xl font-bold lowercase text-black group-hover:text-gray-700 transition-colors">
                thelineup
              </span>
            )}
          </div>
        </Link>
      </div>
    );
  }
);

BrandLogo.displayName = "BrandLogo";
