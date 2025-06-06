
import React from 'react';
import { cn } from '@/lib/utils';

interface LineupImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayVariant?: 'ocean' | 'sunset' | 'default';
  overlayText?: string;
  overlayPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  overlayTextVariant?: 'default' | 'white-text';
  aspectRatio?: 'video' | 'square' | 'wide' | 'hero';
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const aspectRatioClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
  hero: 'aspect-[21/9] md:aspect-[16/9]'
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
  onError
}) => {
  const overlayClass = overlayVariant === 'sunset' ? 'sunset-overlay' : 
                     overlayVariant === 'ocean' ? 'ocean-overlay' : '';

  return (
    <div className={cn(
      'lineup-image-style',
      overlayClass,
      aspectRatioClasses[aspectRatio],
      className
    )}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onError={onError}
        className="w-full h-full object-cover"
      />
      
      {overlayText && (
        <div className={cn('lineup-image-overlay', overlayPosition)}>
          <span className={cn('lineup-overlay-text', overlayTextVariant)}>
            {overlayText}
          </span>
        </div>
      )}
    </div>
  );
};
