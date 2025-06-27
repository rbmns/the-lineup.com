
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Star, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
    },
    {
      path: '/events',
      icon: Calendar,
      label: 'Events',
    },
    {
      path: '/events/create-simple',
      icon: Plus,
      label: 'Create',
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

  if (isMobile) {
    return (
      <div className="flex items-center justify-around h-full px-1 bg-coconut border-t border-overcast">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-1.5 transition-colors rounded-md",
                isActive
                  ? "text-clay bg-sage/30"
                  : "text-midnight hover:text-clay hover:bg-sage/20"
              )}
            >
              <Icon className="h-3.5 w-3.5 mb-0.5" />
              <span className="font-mono text-xs leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-16 bg-coconut">
      <div className="flex flex-col flex-1 items-center justify-start px-2 py-4 space-y-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-1.5 px-1.5 transition-colors rounded-md",
                isActive
                  ? "text-clay bg-sage/30"
                  : "text-midnight hover:text-clay hover:bg-sage/20"
              )}
            >
              <Icon className="h-3.5 w-3.5 mb-0.5" />
              <span className="font-mono text-xs text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
