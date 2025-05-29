import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/polymet/button';
import { Logo } from '@/components/polymet/logo';
import UserAvatarMenu from '@/components/polymet/user-avatar-menu';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  MessageSquare,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={cn("bg-white border-b border-secondary-10 shadow-sm sticky top-0 z-50", className)}>
      <div className="container flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <Logo className="mr-4" />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="font-medium">
            <Search className="w-4 h-4 mr-2" />
            Explore
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            <Users className="w-4 h-4 mr-2" />
            Community
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            <MapPin className="w-4 h-4 mr-2" />
            Places
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button variant="ghost" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* User Avatar Menu */}
        <UserAvatarMenu />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-secondary-10 py-2">
          <div className="container flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start">
              <Search className="w-4 h-4 mr-2" />
              Explore
            </Button>
            <Button variant="ghost" className="justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </Button>
            <Button variant="ghost" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Community
            </Button>
             <Button variant="ghost" className="justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              Places
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
