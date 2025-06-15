import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Coffee, Home, Settings } from 'lucide-react';
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
      icon: Coffee,
      label: 'Plans',
    },
    {
      path: '/friends',
      icon: Users,
      label: 'Friends',
    },
  ];

  if (isMobile) {
    // Mobile horizontal layout at bottom
    return (
      <div className="flex items-center justify-around py-2 px-1 bg-white border-t border-gray-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 min-w-0 flex-1 transition-colors",
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                isActive ? "text-blue-600" : "text-gray-600"
              )} />
              <span className={cn(
                "text-xs font-medium truncate",
                isActive ? "text-blue-600" : "text-gray-600"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Desktop vertical layout, icons centered, settings icon at bottom
  return (
    <div className="h-full flex flex-col items-center w-16 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 items-center justify-start py-4 space-y-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 rounded-lg transition-colors group",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mb-1",
                isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
              )} />
              <span className={cn(
                "text-[10px] font-medium text-center leading-tight",
                isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Settings icon at the bottom */}
      <div className="py-4 w-full flex flex-col items-center">
        <Link
          to="/settings"
          className="flex flex-col items-center w-full py-2 transition-colors text-gray-400 hover:text-gray-700"
        >
          <Settings className="h-5 w-5 mb-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
