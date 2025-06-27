
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateEventButton } from './CreateEventButton';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NavActionsProps {
  onAuthRequired: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({ onAuthRequired }) => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <CreateEventButton onAuthRequired={onAuthRequired} />
          <UserMenu />
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Join</Link>
          </Button>
        </>
      )}
    </div>
  );
};
