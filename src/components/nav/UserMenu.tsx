
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { Settings, LogOut, User as UserIcon, Calendar } from 'lucide-react';

export interface UserMenuProps {
  user: User;
  profile: UserProfile | null;
  handleSignOut: () => Promise<void>;
  canCreateEvents?: boolean;
}

const UserMenu = ({ user, profile, handleSignOut, canCreateEvents }: UserMenuProps) => {
  const navigate = useNavigate();

  const onSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      console.log("UserMenu: initiating sign out");
      await handleSignOut();
      console.log("UserMenu: navigating to goodbye page");
      navigate('/goodbye');
    } catch (error) {
      console.error("UserMenu: error during sign out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <ProfileAvatar profile={profile} size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.username || user.email?.split('@')[0]}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {canCreateEvents && (
            <DropdownMenuItem asChild>
              <Link to="/profile?tab=created" className="w-full cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>My Events</span>
              </Link>
            </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/profile/edit" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
