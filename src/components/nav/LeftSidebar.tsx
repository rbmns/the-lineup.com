
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, Star, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();

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
  ];

  const handleCreateClick = () => {
    navigate('/events/create');
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-around h-full px-2 bg-coconut border-t border-overcast">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-2 transition-colors rounded-md flex-1",
                isActive
                  ? "text-clay bg-sage/30"
                  : "text-midnight hover:text-clay hover:bg-sage/20"
              )}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="font-mono text-xs leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Create Event Button - Center */}
        <button
          onClick={handleCreateClick}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-2 transition-colors rounded-md flex-1",
            "text-white bg-sage hover:bg-sage/80"
          )}
        >
          <Plus className="h-5 w-5 mb-1" />
          <span className="font-mono text-xs leading-tight">
            Create
          </span>
        </button>

        {/* Remaining nav items */}
        <Link
          to="/casual-plans"
          className={cn(
            "flex flex-col items-center justify-center py-2 px-2 transition-colors rounded-md flex-1",
            location.pathname === '/casual-plans'
              ? "text-clay bg-sage/30"
              : "text-midnight hover:text-clay hover:bg-sage/20"
          )}
        >
          <Star className="h-4 w-4 mb-1" />
          <span className="font-mono text-xs leading-tight">
            Plans
          </span>
        </Link>

        <Link
          to="/friends"
          className={cn(
            "flex flex-col items-center justify-center py-2 px-2 transition-colors rounded-md flex-1",
            location.pathname === '/friends'
              ? "text-clay bg-sage/30"
              : "text-midnight hover:text-clay hover:bg-sage/20"
          )}
        >
          <Users className="h-4 w-4 mb-1" />
          <span className="font-mono text-xs leading-tight">
            Friends
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-20 bg-coconut">
      <div className="flex flex-col flex-1 items-center justify-start px-4 py-6 space-y-3 w-full">
        {[...navItems, { path: '/casual-plans', icon: Star, label: 'Plans' }, { path: '/friends', icon: Users, label: 'Friends' }].map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-2 px-2 transition-colors rounded-md",
                isActive
                  ? "text-clay bg-sage/30"
                  : "text-midnight hover:text-clay hover:bg-sage/20"
              )}
            >
              <Icon className="h-4 w-4 mb-1" />
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
