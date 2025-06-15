import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Logo } from '@/components/polymet/logo';

interface InstagramPostTemplateProps {
  brandName: string;
  handle: string;
  content: string;
  imageUrl: string;
}

const InstagramPostTemplate: React.FC<InstagramPostTemplateProps> = ({
  brandName,
  handle,
  content,
  imageUrl,
}) => {
  return (
    <Card className="w-full max-w-md rounded-xl border-none shadow-md">
      <CardHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/api/placeholder/48/48" alt={brandName} />
            <AvatarFallback>{brandName.charAt(0)}</AvatarFallback>
          </Avatar>
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
          alt={content}
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
                <Send className="h-5 w-5" />
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
};

export default InstagramPostTemplate;
