import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Bookmark, Download } from 'lucide-react';
import { typography } from '@/components/polymet/brand-typography';
import { Logo } from '@/components/polymet/logo';

interface SocialMediaTemplateProps {
  template: 'instagram' | 'facebook' | 'twitter';
  title: string;
  content: string;
  imageUrl: string;
  brandName: string;
  handle: string;
}

const SocialMediaTemplate: React.FC<SocialMediaTemplateProps> = ({
  template,
  title,
  content,
  imageUrl,
  brandName,
  handle,
}) => {
  const renderTemplate = () => {
    switch (template) {
      case 'instagram':
        return (
          <Card className="w-full max-w-md rounded-xl border-none shadow-md">
            <CardHeader className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src="/api/placeholder/48/48"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{brandName}</div>
                  <div className="text-xs text-gray-500">{handle}</div>
                </div>
              </div>
              <div className="text-gray-500">...</div>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src={imageUrl}
                alt={title}
                className="aspect-square w-full object-cover"
              />
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mb-2 text-sm">
                  <span className="font-semibold">{brandName}</span> {content}
                </div>
                <div className="text-xs text-gray-500">View all comments</div>
              </div>
            </CardContent>
          </Card>
        );
      case 'facebook':
        return (
          <Card className="w-full max-w-md rounded-xl border-none shadow-md">
            <CardHeader className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src="/api/placeholder/48/48"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{brandName}</div>
                  <div className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-500">...</div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-3">{content}</div>
              <img
                src={imageUrl}
                alt={title}
                className="w-full object-cover rounded-md mb-3"
              />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <Button variant="ghost" size="sm">
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm">
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'twitter':
        return (
          <Card className="w-full max-w-md rounded-xl border-none shadow-md">
            <CardHeader className="flex items-start space-x-3 p-4">
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <img
                  src="/api/placeholder/48/48"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <div className="font-semibold">{brandName}</div>
                  <div className="text-gray-500">{handle}</div>
                </div>
                <div className="text-sm mb-2">{content}</div>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full object-cover rounded-md mb-3"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      default:
        return <div>Template not supported</div>;
    }
  };

  return renderTemplate();
};

export default SocialMediaTemplate;
