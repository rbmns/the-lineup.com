import { Badge } from '@/components/ui/badge';
import { Music, Users } from 'lucide-react';

interface EventVibeAndCategorySectionProps {
  vibe?: string | null;
  category?: string | null;
}

export const EventVibeAndCategorySection = ({ 
  vibe, 
  category 
}: EventVibeAndCategorySectionProps) => {
  if (!vibe && !category) return null;

  return (
    <div className="flex items-start space-x-2">
      <Music className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg mb-2">Event Details</p>
        <div className="flex flex-wrap gap-2">
          {category && (
            <Badge variant="outline" className="text-sm">
              {category}
            </Badge>
          )}
          {vibe && (
            <Badge variant="secondary" className="text-sm">
              {vibe}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};