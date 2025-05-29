import React from 'react';
import { Link } from 'react-router-dom';
import { brandColors } from '@/components/polymet/brand-colors';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className = '', showText = true }, ref) => {
    return (
      <div ref={ref} className={`flex items-center gap-2 ${className}`}>
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="flex items-center">
            <span className="text-lg font-medium lowercase text-black">thelineup</span>
          </div>
        </Link>
      </div>
    );
  }
);

Logo.displayName = "Logo";
