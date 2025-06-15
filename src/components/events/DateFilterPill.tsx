
import React from 'react';
import { cn } from '@/lib/utils';

interface DateFilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const DateFilterPill: React.FC<DateFilterPillProps> = ({
  label,
  active,
  onClick,
  className
}) => {
  const baseClasses = cn(
    'px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-300',
    active 
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'bg-secondary text-secondary-foreground hover:bg-muted/50 hover:shadow-sm',
    className
  );

  return (
    <div onClick={onClick} className={baseClasses}>
      <span>{label}</span>
    </div>
  );
};
