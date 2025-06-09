
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
      <div ref={ref} className={`flex items-center ${className}`}> {/* Removed gap-2 */}
        <Link to="/" className="flex items-center group transition-all duration-300">
          <div className="flex items-center">
            {/* Always show the full text "thelineup" regardless of device size */}
            <span className="text-xl font-medium lowercase text-black">thelineup</span> {/* Increased from text-lg to text-xl */}
          </div>
        </Link>
      </div>
    );
  }
);

BrandLogo.displayName = "BrandLogo";
