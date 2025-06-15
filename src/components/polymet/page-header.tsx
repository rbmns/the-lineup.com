
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  backButtonHref?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backButtonHref,
  className,
}) => {
  return (
    <div className={cn("mb-8 space-y-2", className)}>
      {backButtonHref && (
        <Button variant="ghost" size="sm" asChild>
          <a href={backButtonHref} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        </Button>
      )}
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
