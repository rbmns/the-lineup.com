
import React from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MusicIcon,
  ShapesIcon as WaveIcon,
  UtensilsIcon,
  ShoppingBagIcon,
  UsersIcon,
  PaletteIcon,
  GamepadIcon,
  SunIcon,
  TentIcon,
  HeartIcon,
  GlobeIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { Event } from '@/types';

interface HomeCategoriesSectionProps {
  events: Event[] | undefined;
  className?: string;
}

interface CategoryItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  categoryKey: string;
}

export const HomeCategoriesSection: React.FC<HomeCategoriesSectionProps> = ({ 
  events, 
  className 
}) => {
  const allCategories: CategoryItem[] = [
    {
      name: "Music",
      icon: <MusicIcon className="h-6 w-6" />,
      href: "/events?category=music",
      color: "bg-blue-50 text-blue-600",
      categoryKey: "music",
    },
    {
      name: "Surf",
      icon: <WaveIcon className="h-6 w-6" />,
      href: "/events?category=surf",
      color: "bg-cyan-50 text-cyan-600",
      categoryKey: "surf",
    },
    {
      name: "Food",
      icon: <UtensilsIcon className="h-6 w-6" />,
      href: "/events?category=food",
      color: "bg-orange-50 text-orange-600",
      categoryKey: "food",
    },
    {
      name: "Market",
      icon: <ShoppingBagIcon className="h-6 w-6" />,
      href: "/events?category=market",
      color: "bg-amber-50 text-amber-600",
      categoryKey: "market",
    },
    {
      name: "Community",
      icon: <UsersIcon className="h-6 w-6" />,
      href: "/events?category=community",
      color: "bg-green-50 text-green-600",
      categoryKey: "community",
    },
    {
      name: "Art & Culture",
      icon: <PaletteIcon className="h-6 w-6" />,
      href: "/events?category=art",
      color: "bg-purple-50 text-purple-600",
      categoryKey: "art",
    },
    {
      name: "Game",
      icon: <GamepadIcon className="h-6 w-6" />,
      href: "/events?category=game",
      color: "bg-red-50 text-red-600",
      categoryKey: "game",
    },
    {
      name: "Yoga",
      icon: <SunIcon className="h-6 w-6" />,
      href: "/events?category=yoga",
      color: "bg-yellow-50 text-yellow-600",
      categoryKey: "yoga",
    },
    {
      name: "Festival",
      icon: <TentIcon className="h-6 w-6" />,
      href: "/events?category=festival",
      color: "bg-pink-50 text-pink-600",
      categoryKey: "festival",
    },
    {
      name: "Sports",
      icon: <HeartIcon className="h-6 w-6" />,
      href: "/events?category=sports",
      color: "bg-indigo-50 text-indigo-600",
      categoryKey: "sports",
    },
    {
      name: "Culture",
      icon: <GlobeIcon className="h-6 w-6" />,
      href: "/events?category=culture",
      color: "bg-emerald-50 text-emerald-600",
      categoryKey: "culture",
    },
  ];

  // Filter categories to only show those with available events
  const availableCategories = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const eventCategories = new Set(
      events
        .map(event => event.event_category)
        .filter(Boolean)
        .map(cat => cat.toLowerCase())
    );
    
    console.log('Available event categories:', Array.from(eventCategories));
    
    const filteredCategories = allCategories.filter(category => 
      eventCategories.has(category.categoryKey)
    );
    
    // Always add "More" option if there are any events
    if (filteredCategories.length > 0) {
      filteredCategories.push({
        name: "More",
        icon: <MoreHorizontalIcon className="h-6 w-6" />,
        href: "/events",
        color: "bg-gray-50 text-gray-600",
        categoryKey: "more",
      });
    }
    
    console.log('Filtered categories:', filteredCategories.map(c => c.name));
    return filteredCategories;
  }, [events]);

  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12 md:py-16 bg-gradient-to-br from-white via-secondary-25 to-secondary-10", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto leading-relaxed">
            Discover events that match your interests and connect with like-minded people
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:gap-4">
          {availableCategories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group flex flex-col items-center rounded-xl p-4 transition-all hover:bg-white hover:shadow-xl transform hover:-translate-y-1 duration-300"
            >
              <div
                className={cn(
                  "mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:scale-110",
                  category.color
                )}
              >
                {category.icon}
              </div>
              <span className="text-center text-sm font-medium text-primary group-hover:text-primary/80">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
