
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, User, Calendar, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateEventButton } from './CreateEventButton';

interface NavActionsProps {
  onAuthRequired?: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({ onAuthRequired }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Events Navigation */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          asChild
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          className={cn(
            "text-midnight hover:text-overcast hover:bg-sage/20",
            isMobile ? "text-sm px-2" : "text-sm px-3"
          )}
        >
          <Link to="/events">Events</Link>
        </Button>
        
        <CreateEventButton onAuthRequired={onAuthRequired} />
      </div>

      {/* User Actions */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className={cn(
                "flex items-center gap-2 text-midnight hover:text-overcast hover:bg-sage/20",
                isMobile ? "text-sm px-2" : "text-sm px-3"
              )}
            >
              <User className="h-4 w-4" />
              {!isMobile && <span>{user.username || 'Profile'}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/events/my" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                My Events
              </Link>
            </DropdownMenuItem>
            {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={onAuthRequired}
          className={cn(
            "border-sage bg-coconut text-midnight hover:bg-seafoam hover:border-overcast",
            isMobile ? "text-sm px-3" : "text-sm px-4"
          )}
        >
          Login
        </Button>
      )}
    </div>
  );
};
