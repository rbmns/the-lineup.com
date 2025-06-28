
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CreateEventButtonProps {
  onAuthRequired?: () => void;
}

export const CreateEventButton: React.FC<CreateEventButtonProps> = ({
  onAuthRequired
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleCreateEventClick = () => {
    navigate('/events/create');
  };

  return (
    <Button
      variant="accent"
      onClick={handleCreateEventClick}
      className={cn(
        "flex items-center gap-2 flex-shrink-0",
        isMobile ? "text-sm px-3 py-2" : "text-sm px-4 py-2"
      )}
    >
      <Plus className="h-4 w-4" />
      {!isMobile && "Create Event"}
    </Button>
  );
};
