import React from 'react';
import { brandColors, type BackgroundColor } from '@/components/polymet/brand-colors';
import { Logo } from '@/components/polymet/logo';
import { cn } from '@/lib/utils';

interface UICardExampleProps {
  backgroundColor?: BackgroundColor;
  showLogo?: boolean;
  showTitle?: boolean;
  titleText?: string;
  showDescription?: boolean;
  descriptionText?: string;
}

const UICardExample: React.FC<UICardExampleProps> = ({
  backgroundColor = '50',
  showLogo = true,
  showTitle = true,
  titleText = 'Your Title Here',
  showDescription = true,
  descriptionText = 'A brief description or supporting text.',
}) => {
  const bgColorClass = `bg-primary-${backgroundColor}`;

  return (
    <div className={cn("rounded-lg shadow-md p-6", bgColorClass)}>
      {showLogo && (
        <div className="mb-4">
          <Logo />
        </div>
      )}

      {showTitle && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {titleText}
        </h2>
      )}

      {showDescription && (
        <p className="text-gray-600">
          {descriptionText}
        </p>
      )}
    </div>
  );
};

export default UICardExample;
