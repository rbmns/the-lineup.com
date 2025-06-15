
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HeroSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  className,
}) => {
  return (
    <section className={cn("py-24 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="lg:flex items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-700 mb-6">{description}</p>
            <Button size="lg" asChild>
              <a href={buttonLink}>{buttonText}</a>
            </Button>
          </div>
          <div className="lg:w-1/2">
            <Card>
              <CardContent className="p-4">
                <img
                  src="https://source.unsplash.com/random/800x600"
                  alt="Placeholder"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
