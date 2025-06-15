import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage, // no longer used
  className = ""
}) => {
  return (
    <div className={`relative h-[200px] md:h-[250px] overflow-hidden w-full ${className} bg-ocean-deep-600`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep-600 to-ocean-deep-400 opacity-70"></div>
      
      {/* Content - Left aligned */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-6 lg:px-8 text-left text-white">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-left">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl text-left">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
