
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

interface NavItemsProps {
  className?: string;
}

export const NavItems: React.FC<NavItemsProps> = ({ className }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={`flex items-center space-x-6 ${className || ''}`}>
      <Link to="/events" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5">
        <Calendar className="h-4 w-4" />
        <span>Events</span>
      </Link>
      <Link to="/friends" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5">
        <Users className="h-4 w-4" />
        <span>Friends</span>
      </Link>
    </div>
  );
};
