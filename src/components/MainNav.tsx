
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
  const isMobile = useIsMobile();
  const location = useLocation();

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

  return <>
      <header className="sticky top-0 left-0 right-0 z-50 w-full bg-coconut border-b border-clay/20 shadow-navigation">
        <div className="w-full flex flex-col">
          <div className={cn("w-full flex items-center justify-between", isMobile ? "px-4 py-2" : "px-6 py-2")}>
            {/* Left side - Logo */}
            <div className="flex items-center h-full flex-shrink-0">
              {!isMobile && <Link to="/" className="flex items-center justify-center mr-2 flex-shrink-0">
                  <img src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" alt="the lineup Symbol" className="w-4 h-4 transition-opacity hover:opacity-80" />
                </Link>}
              <Link to="/" className={cn("font-display font-bold text-midnight hover:text-clay transition-colors", isMobile ? "text-lg" : "text-xl")}>
                the lineup
              </Link>
            </div>

            {/* Center - Navigation (Desktop only) */}
            {!isMobile && <nav className="flex items-center space-x-1">
                {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return <Link key={item.path} to={item.path} className={cn("flex items-center gap-2 px-3 py-2 rounded-md font-body text-sm font-medium transition-all duration-200", isActive ? "text-midnight bg-vibrant-aqua/20" : "text-midnight hover:text-vibrant-aqua hover:bg-sage/20 hover:-translate-y-0.5")}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>;
            })}
              </nav>}

            {/* Right side - User Actions */}
            <NavActions onAuthRequired={handleAuthRequired} showCreateButton={false} />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50 bg-coconut border-t border-clay/20 shadow-navigation pb-safe">
          <nav className="flex items-center justify-around px-4 py-1.5">
            {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return <Link key={item.path} to={item.path} className={cn("flex flex-col items-center gap-0.5 px-3 py-1 rounded-md font-mono text-xs font-medium transition-all duration-200 uppercase", isActive ? "text-midnight bg-vibrant-aqua/20" : "text-midnight hover:text-vibrant-aqua hover:bg-sage/20")}>
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>;
        })}
          </nav>
        </div>}

      {/* Auth Overlay */}
      {showAuthOverlay && <AuthOverlay title="Join to Create Events" description="Sign up or log in to create and organize your own events!" browseEventsButton={true} onClose={handleCloseAuthOverlay} onBrowseEvents={handleCloseAuthOverlay}>
          <></>
        </AuthOverlay>}
    </>;
};

export default MainNav;
