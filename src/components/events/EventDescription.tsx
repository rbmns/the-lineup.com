
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { renderHTML } from '@/lib/utils';

interface EventDescriptionProps {
  description: string;
  isMobile: boolean;
}

export const EventDescription: React.FC<EventDescriptionProps> = ({ description, isMobile }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const hasDescription = !!description && description.trim() !== '';

  // Check if the content needs expansion (is overflowing)
  useEffect(() => {
    if (isMobile && descriptionRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight);
      const maxHeight = lineHeight * 6; // 6 lines
      setNeedsExpansion(descriptionRef.current.scrollHeight > maxHeight);
    } else {
      setNeedsExpansion(false);
    }
  }, [description, isMobile]);

  // Toggle description expansion for mobile
  const toggleDescription = () => {
    setShowFullDescription(prev => !prev);
  };

  if (!hasDescription) {
    return (
      <div className="pt-4 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <p className="text-gray-500 italic">No description provided for this event.</p>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-medium mb-3">About this event</h3>
      {isMobile ? (
        <div>
          <div 
            ref={descriptionRef}
            className={`text-gray-700 prose max-w-none whitespace-pre-line ${!showFullDescription && needsExpansion ? 'line-clamp-6' : ''}`}
            dangerouslySetInnerHTML={renderHTML(description)}
          />
          {needsExpansion && (
            <Button
              variant="ghost"
              className="flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800 p-0 h-auto"
              onClick={toggleDescription}
            >
              {showFullDescription ? 'Show less' : 'Read more'} 
              <ChevronDown className={`h-4 w-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
      ) : (
        <div 
          className="text-gray-700 prose max-w-none whitespace-pre-line"
          dangerouslySetInnerHTML={renderHTML(description)}
        />
      )}
    </div>
  );
};

export default EventDescription;
