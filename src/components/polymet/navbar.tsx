
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/polymet/button';

// Simple Logo component for navbar
const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-primary rounded-full"></div>
    <span className="font-medium text-lg">thelineup</span>
  </div>
);

// Simple UserAvatarMenu component with mock data
const UserAvatarMenu: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    <span className="text-sm">User</span>
  </div>
);

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav className={cn("flex items-center justify-between p-4 border-b", className)}>
      <Logo />
      
      <div className="hidden md:flex items-center space-x-6">
        <a href="/events" className="text-sm font-medium hover:text-primary">Events</a>
        <a href="/venues" className="text-sm font-medium hover:text-primary">Venues</a>
        <a href="/about" className="text-sm font-medium hover:text-primary">About</a>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
        <Button size="sm">
          Sign Up
        </Button>
        <UserAvatarMenu />
      </div>
    </nav>
  );
};

export default Navbar;
