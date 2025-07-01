
import { User, ExternalLink } from 'lucide-react';

interface EventOrganizerSectionProps {
  organizerName: string;
  organizerLink?: string | null;
}

export const EventOrganizerSection = ({ 
  organizerName, 
  organizerLink 
}: EventOrganizerSectionProps) => {
  return (
    <div className="flex items-start space-x-2">
      <User className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg">{organizerName}</p>
        {organizerLink && (
          <div className="flex items-center gap-1 mt-1">
            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
            <a 
              href={organizerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Visit organizer website
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
