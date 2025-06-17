
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppPageHeaderProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const AppPageHeader: React.FC<AppPageHeaderProps> = ({ 
  children, 
  subtitle,
  className = "" 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full bg-white border-b border-gray-200">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight text-gray-900 mb-4 leading-tight ${className}`}>
            {children}
          </h1>
          {subtitle && (
            <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppPageHeader;
