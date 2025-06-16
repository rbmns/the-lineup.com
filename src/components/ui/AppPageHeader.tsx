
import React from "react";
import { typography } from "@/components/polymet/brand-typography";
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
    <div className="relative w-full min-h-[200px] md:min-h-[250px] overflow-hidden bg-gradient-to-br from-[#005F73] via-[#2A9D8F] to-[#00B4DB] m-0 p-0">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[200px] md:min-h-[250px] text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight text-white mb-4 leading-tight ${className}`}>
            {children}
          </h1>
          {subtitle && (
            <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-white/90 max-w-2xl mx-auto leading-relaxed font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default AppPageHeader;
