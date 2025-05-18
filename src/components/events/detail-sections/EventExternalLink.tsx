
import { ExternalLink } from 'lucide-react';

interface EventExternalLinkProps {
  url: string;
}

export const EventExternalLink = ({ url }: EventExternalLinkProps) => {
  if (!url) return null;
  
  return (
    <div>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 font-medium flex items-center gap-1.5 hover:underline"
      >
        <ExternalLink className="h-4 w-4" /> Visit event website
      </a>
    </div>
  );
};
