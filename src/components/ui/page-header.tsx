
import React from 'react';
import { typography } from '@/components/polymet/brand-typography';

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
  return (
    <div className={`relative h-[200px] md:h-[250px] overflow-hidden w-full ${className} bg-secondary m-0 p-0`}>
      {/* Content - Left aligned */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-6 lg:px-8 text-left text-foreground m-0 p-0">
        <h1 className={`${typography.h1} mb-4 text-left`}>
          {title}
        </h1>
        <p className={`${typography.lead} text-left`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

