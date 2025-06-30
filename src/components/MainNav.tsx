
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

  // Determine nav background - always opaque
  const getNavBackground = () => {
    if (isHomePage && !isScrolled) {
      return 'bg-pure-white/95 backdrop-blur-md';
    }
    return 'bg-pure-white';
  };

  // Text color is always consistent
  const getTextColor = () => {
    return 'text-graphite-grey';
  };

  // Always show border/shadow for clarity
  const shouldShowBorder = true;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 overflow-x-hidden",
        getNavBackground(),
        shouldShowBorder && "border-b border-mist-grey shadow-md"
      )}>
        <div className="w-full flex flex-col overflow-x-hidden">
          <div className={cn(
            "w-full flex items-center justify-between transition-all duration-300 max-w-full overflow-x-hidden",
            isMobile ? "px-4 py-3" : "px-6 py-3"
          )}>
            {/* Left side - Logo */}
            <div className="flex items-center h-full flex-shrink-0 min-w-0">
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
                "font-display font-bold hover:text-ocean-teal transition-colors text-xl truncate",
                getTextColor()
              )}>
                the lineup
              </Link>
            </div>

            {/* Center - Navigation (Desktop only) */}
            {!isMobile && (
              <nav className="flex items-center space-x-1 overflow-x-hidden">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      className={cn(
                        "nav-link flex items-center gap-2 px-4 py-2 rounded-md font-montserrat text-sm font-medium transition-all duration-200 whitespace-nowrap",
                        isActive 
                          ? "bg-ocean-teal/15 text-ocean-teal" 
                          : "text-graphite-grey hover:text-ocean-teal hover:bg-ocean-teal/10"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right side - User Actions */}
            <NavActions onAuthRequired={handleAuthRequired} showCreateButton={false} />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Fully opaque */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-pure-white border-t border-mist-grey shadow-lg pb-safe overflow-x-hidden">
          <nav className="flex items-center justify-around px-2 py-2 max-w-full overflow-x-hidden">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-md font-montserrat text-xs font-medium transition-all duration-200 uppercase min-w-0 flex-1 text-center",
                    isActive 
                      ? "text-ocean-teal bg-ocean-teal/15" 
                      : "text-graphite-grey hover:text-ocean-teal hover:bg-ocean-teal/10"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

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
