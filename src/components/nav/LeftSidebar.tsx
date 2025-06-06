
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

const LeftSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
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

  return (
    <div className="hidden md:flex w-20 bg-white border-r border-gray-200 flex-col items-center py-6 space-y-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg transition-colors group",
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
              "text-xs font-medium",
              isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default LeftSidebar;
