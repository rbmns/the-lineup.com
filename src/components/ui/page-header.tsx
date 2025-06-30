
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle: string;
  backgroundImage?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage,
  className = ""
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full bg-pure-white border-b border-mist-grey">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-h2' : 'text-h1'} font-display font-bold tracking-tight text-graphite-grey mb-4 leading-tight ${className}`}>
            {title}
          </h1>
          <p className={`${isMobile ? 'text-body-base' : 'text-body-base'} text-graphite-grey/80 max-w-2xl mx-auto leading-relaxed font-lato font-medium`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
