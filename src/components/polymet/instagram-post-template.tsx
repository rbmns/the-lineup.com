import React from 'react';
import { brandColors } from '@/components/polymet/brand-colors';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/polymet/button';
import { Heart, MessageCircle, Share, Bookmark } from 'lucide-react';
import { typography } from '@/components/polymet/brand-typography';
import { Logo } from '@/components/polymet/logo';

interface InstagramPostTemplateProps {
  imageSrc: string;
  logoSrc?: string;
  title: string;
  category: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

const InstagramPostTemplate: React.FC<InstagramPostTemplateProps> = ({
  imageSrc,
  logoSrc,
  title,
  category,
  description,
  likes,
  comments,
  shares,
}) => {
  return (
    <Card className="w-full max-w-md rounded-xl border-none shadow-md">
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="aspect-square w-full object-cover"
        />
        <div className="absolute top-4 left-4">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
          ) : (
            <Logo className="h-8" />
          )}
        </div>
        <Badge className="absolute top-4 right-4 rounded-full">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className={cn(typography.h3, "mb-2")}>{title}</h3>
        <p className="text-sm text-primary-75">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="ml-1 text-sm">{likes}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
              <span className="ml-1 text-sm">{comments}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
              <span className="ml-1 text-sm">{shares}</span>
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstagramPostTemplate;
