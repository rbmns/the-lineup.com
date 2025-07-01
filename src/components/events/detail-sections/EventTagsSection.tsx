
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface EventTagsSectionProps {
  tags?: string[] | string | null;
}

export const EventTagsSection = ({ tags }: EventTagsSectionProps) => {
  // Process tags for display - with proper type handling
  const eventTags = useMemo(() => {
    try {
      // If tags is undefined or null, return empty array
      if (!tags) return [];
      
      // If tags is already an array, return filtered version
      if (Array.isArray(tags)) {
        return tags.filter(tag => !!tag);
      }
      
      // If tags is a string, try to parse it as JSON first (for cases like ["tag1", "tag2"])
      if (typeof tags === 'string') {
        // Check if it looks like a JSON array
        if (tags.startsWith('[') && tags.endsWith(']')) {
          try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
              return parsed.filter(tag => !!tag);
            }
          } catch (e) {
            // If JSON parsing fails, fall back to comma splitting
            console.warn('Failed to parse tags as JSON, falling back to comma split:', e);
          }
        }
        
        // Split by comma as fallback
        return tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
      
      // For any other types, log warning and return empty array
      console.warn('Unexpected tags format:', typeof tags, tags);
      return [];
    } catch (error) {
      console.error('Error processing tags:', error);
      return [];
    }
  }, [tags]);

  if (eventTags.length === 0) return null;

  return (
    <div className="flex items-start space-x-2">
      <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg mb-2">Tags</p>
        <div className="flex flex-wrap gap-2">
          {eventTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
