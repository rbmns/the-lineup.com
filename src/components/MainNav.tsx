
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { NavActions } from './nav/NavActions';
import { Calendar, Users, Star } from 'lucide-react';

const MainNav = () => {
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleAuthRequired = () => {
    setShowAuthOverlay(true);
  };

  const navItems = [
    {
      path: '/events',
      icon: Calendar,
      label: 'Events',
    },
    {
      path: '/casual-plans',
      icon: Star,
      label: 'Plans',
    },
    {
      path: '/friends',
      icon: Users,
      label: 'Friends',
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-coconut border-b border-overcast">
        <div className="w-full flex flex-col">
          <div className={cn(
            "w-full flex items-center justify-between",
            isMobile ? "px-3 py-2" : "px-4 py-2.5"
          )}>
            {/* Left side - Logo */}
            <div className="flex items-center h-full flex-shrink-0">
              {!isMobile && (
                <Link to="/" className="flex items-center justify-center mr-3 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                    alt="thelineup Symbol" 
                    className="w-6 h-6 transition-opacity hover:opacity-80" 
                  />
                </Link>
              )}
              <BrandLogo 
                showText={true} 
                className="font-display text-lg text-midnight hover:text-overcast transition-colors" 
              />
            </div>

            {/* Center - Navigation (Desktop only) */}
            {!isMobile && (
              <nav className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "text-clay bg-sage/30"
                          : "text-midnight hover:text-clay hover:bg-sage/20"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right side - Actions (always includes Create on desktop) */}
            <NavActions 
              onAuthRequired={handleAuthRequired}
            />
          </div>
        </div>
      </header>

      {/* Auth Overlay */}
      {showAuthOverlay && (
        <AuthOverlay
          title="Join to Create Events"
          description="Sign up or log in to create and organize your own events!"
          browseEventsButton={true}
          onClose={handleCloseAuthOverlay}
          onBrowseEvents={handleCloseAuthOverlay}
        >
          <></>
        </AuthOverlay>
      )}
    </>
  );
};

export default MainNav;
