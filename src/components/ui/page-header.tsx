
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
      {/* Content using design system classes */}
      <div className="section-content-narrow text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-h2' : 'text-h1'} text-graphite-grey mb-4 ${className}`}>
            {title}
          </h1>
          <p className={`text-body-base text-graphite-grey/80 max-w-2xl mx-auto`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
