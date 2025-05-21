
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface NavItemsProps {
  className?: string;
}

export const NavItems: React.FC<NavItemsProps> = ({ className }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={`flex items-center space-x-6 ${className || ''}`}>
      <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link to="/events" className="text-sm font-medium transition-colors hover:text-primary">
        Events
      </Link>
      <Link 
        to="/design-system" 
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Design System
      </Link>
      {isAuthenticated ? (
        <>
          <Link to="/profile" className="text-sm font-medium transition-colors hover:text-primary">
            {user?.email?.split('@')[0] || 'Profile'}
          </Link>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
            Login
          </Link>
          <Link to="/register" className="text-sm font-medium transition-colors hover:text-primary">
            Register
          </Link>
        </>
      )}
    </div>
  );
};
