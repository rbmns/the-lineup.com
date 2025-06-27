
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const CreateEventButton: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link to="/events/create-simple">
      <Button 
        className="bg-midnight text-ivory hover:bg-overcast flex items-center gap-2"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Create Event
      </Button>
    </Link>
  );
};

export default CreateEventButton;
