import React from 'react';
import { cn } from '@/lib/utils';
import { brandColors, type BackgroundColor } from '@/components/polymet/brand-colors';
import { Button } from '@/components/polymet/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageTreatmentExampleProps {
  backgroundColor: BackgroundColor;
  title: string;
  description: string;
  imageSrc: string;
  className?: string;
}

const ImageTreatmentExample: React.FC<ImageTreatmentExampleProps> = ({
  backgroundColor,
  title,
  description,
  imageSrc,
  className,
}) => {
  const bgColorClass = `bg-${backgroundColor}-500`;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-md">
          <img
            src={imageSrc}
            alt={title}
            className="object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Badge className={bgColorClass}>{backgroundColor}</Badge>
      </CardContent>
    </Card>
  );
};

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ className, children }) => {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  );
};

const ImageTreatmentGuide: React.FC = () => {
  return (
    <section className="container grid items-start gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
      <ImageTreatmentExample
        backgroundColor="primary"
        title="Hero Image"
        description="Used for main website banners and promotional materials."
        imageSrc="https://images.unsplash.com/photo-1680269243397-099a9fc9904f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2835&q=80"
      />
      <ImageTreatmentExample
        backgroundColor="secondary"
        title="Event Thumbnail"
        description="Smaller images used in event listings and cards."
        imageSrc="https://images.unsplash.com/photo-1679759017939-153956a4974c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
      />
      <ImageTreatmentExample
        backgroundColor="accent"
        title="Profile Avatar"
        description="Circular images used for user profiles."
        imageSrc="https://images.unsplash.com/photo-1679692474059-619f5ca95944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
      />
    </section>
  );
};

export default ImageTreatmentGuide;
