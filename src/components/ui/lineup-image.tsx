
import React from 'react';
import { cn } from '@/lib/utils';

interface LineupImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayVariant?: 'ocean' | 'sunset' | 'default' | 'none';
  overlayText?: string;
  overlayPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  overlayTextVariant?: 'default' | 'white-text';
  aspectRatio?: 'video' | 'square' | 'wide' | 'hero' | '4/3';
  loading?: 'lazy' | 'eager';
  treatment?: 'subtle-overlay' | 'warm-filter' | 'none';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const aspectRatioClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
  hero: 'aspect-[21/9] md:aspect-[16/9]',
  '4/3': 'aspect-[4/3]'
};

const treatmentClasses = {
  'subtle-overlay': '',
  'warm-filter': 'brightness-105 saturate-110 sepia-[0.15]',
  'none': ''
};

const overlayClasses = {
  ocean: 'bg-nature-ocean/20 mix-blend-overlay',
  sunset: 'bg-vibrant-sunset/20 mix-blend-overlay',
  default: 'bg-primary/20 mix-blend-overlay',
  none: ''
};

export const LineupImage: React.FC<LineupImageProps> = ({
  src,
  alt,
  className,
  overlayVariant = 'default',
  overlayText,
  overlayPosition = 'bottom-left',
  overlayTextVariant = 'default',
  aspectRatio = 'video',
  loading = 'lazy',
  treatment = 'subtle-overlay',
  onError
}) => {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onError={onError}
        className={cn(
          'w-full h-full object-cover',
          treatmentClasses[treatment]
        )}
      />
      
      {/* Subtle brand overlay for treatment */}
      {treatment === 'subtle-overlay' && overlayVariant !== 'none' && (
        <div className={cn(
          'absolute inset-0 rounded-lg',
          overlayClasses[overlayVariant]
        )} />
      )}
      
      {overlayText && (
        <div className={cn('absolute z-10', {
          'bottom-4 left-4': overlayPosition === 'bottom-left',
          'bottom-4 right-4': overlayPosition === 'bottom-right',
          'top-4 left-4': overlayPosition === 'top-left',
          'top-4 right-4': overlayPosition === 'top-right',
        })}>
          <span className={cn(
            'px-3 py-1 rounded-md text-sm font-medium',
            overlayTextVariant === 'white-text' 
              ? 'bg-black/50 text-white' 
              : 'bg-white/90 text-primary'
          )}>
            {overlayText}
          </span>
        </div>
      )}
    </div>
  );
};
