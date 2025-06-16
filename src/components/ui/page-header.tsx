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
  return <div className={`relative h-[200px] md:h-[250px] overflow-hidden w-full bg-secondary m-0 p-0 ${className}`}>
      {/* Content - Left aligned */}
      <div className="absolute inset-0 flex flex-col justify-center text-center text-foreground m-0 p-0 max-w-4xl mx-auto w-full">
        <h1 className={`${typography.h1} mb-4 text-left mt-0`}>
          {title}
        </h1>
        <p className={`${typography.lead} text-left mt-0`}>
          {subtitle}
        </p>
      </div>
    </div>;
};