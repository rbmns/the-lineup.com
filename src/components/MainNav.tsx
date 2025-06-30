
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { NavActions } from './nav/NavActions';
import { Calendar, Users, Star, Plus } from 'lucide-react';

const MainNav = () => {
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle scroll detection for home page transparency effect
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleAuthRequired = () => {
    setShowAuthOverlay(true);
  };

  const navItems = [{
    path: '/events',
    icon: Calendar,
    label: 'Events'
  }, {
    path: '/events/create',
    icon: Plus,
    label: 'Create'
  }, {
    path: '/casual-plans',
    icon: Star,
    label: 'Plans'
  }, {
    path: '/friends',
    icon: Users,
    label: 'Friends'
  }];

  // Use global nav classes
  const getNavClasses = () => {
    if (isHomePage && !isScrolled) {
      return 'nav-desktop nav-desktop-transparent';
    }
    return 'nav-desktop nav-desktop-solid';
  };

  const getTextColor = () => {
    if (isHomePage && !isScrolled) {
      return 'nav-link-light';
    }
    return '';
  };

  return <>
    <header className={getNavClasses()}>
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center h-full flex-shrink-0">
          {!isMobile && (
            <Link to="/" className="flex items-center justify-center mr-3 flex-shrink-0">
              <img 
                src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                alt="the lineup Symbol" 
                className="w-4 h-4 transition-opacity hover:opacity-80" 
              />
            </Link>
          )}
          <Link to="/" className={cn(
            "text-h3 font-montserrat font-bold transition-colors duration-200",
            getTextColor() || "text-graphite-grey hover:text-ocean-teal"
          )}>
            the lineup
          </Link>
        </div>

        {/* Center - Navigation Links (Desktop) */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "nav-link",
                    getTextColor(),
                    isActive && "nav-link-active"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side - Auth Actions */}
        <div className="flex items-center space-x-4">
          <NavActions 
            onAuthRequired={handleAuthRequired}
            className={getTextColor()}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="nav-mobile-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="nav-mobile-item"
              >
                <Icon className={cn(
                  "nav-mobile-icon",
                  isActive && "nav-mobile-icon-active"
                )} />
                <span className={cn(
                  "nav-mobile-label",
                  isActive && "nav-mobile-label-active"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </header>

    <AuthOverlay 
      isOpen={showAuthOverlay} 
      onClose={handleCloseAuthOverlay} 
    />
  </>;
};

export default MainNav;
