
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Star, Home } from 'lucide-react';
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
      <div className="flex items-center justify-around h-full px-2 bg-sand border-t border-overcast">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-3 transition-colors rounded-sm",
                isActive
                  ? "text-charcoal bg-sage"
                  : "text-overcast hover:text-charcoal hover:bg-sage/30"
              )}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="font-body text-xs leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-20 bg-sand border-r border-overcast">
      <div className="flex flex-col flex-1 items-center justify-start py-6 space-y-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-4 px-2 transition-colors rounded-sm",
                isActive
                  ? "bg-sage text-charcoal"
                  : "text-overcast hover:text-charcoal hover:bg-sage/30"
              )}
            >
              <Icon className="h-5 w-5 mb-2" />
              <span className="font-body text-xs text-center leading-tight">
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
