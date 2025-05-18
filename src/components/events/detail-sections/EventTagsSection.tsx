
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

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
      
      // If tags is a string, split by comma
      if (typeof tags === 'string') {
        const tagsString: string = tags;
        return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
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
    <div className="pt-2">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {eventTags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
