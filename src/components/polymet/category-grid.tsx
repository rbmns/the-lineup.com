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

interface CategoryGridProps {
  title?: string;
  className?: string;
}

interface CategoryItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function CategoryGrid({ title, className }: CategoryGridProps) {
  const categories: CategoryItem[] = [
    {
      name: "Music",
      icon: <MusicIcon className="h-6 w-6" />,

      href: "/events?category=music",
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Surf",
      icon: <WaveIcon className="h-6 w-6" />,

      href: "/events?category=surf",
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      name: "Food",
      icon: <UtensilsIcon className="h-6 w-6" />,

      href: "/events?category=food",
      color: "bg-orange-50 text-orange-600",
    },
    {
      name: "Market",
      icon: <ShoppingBagIcon className="h-6 w-6" />,

      href: "/events?category=market",
      color: "bg-amber-50 text-amber-600",
    },
    {
      name: "Community",
      icon: <UsersIcon className="h-6 w-6" />,

      href: "/events?category=community",
      color: "bg-green-50 text-green-600",
    },
    {
      name: "Art & Culture",
      icon: <PaletteIcon className="h-6 w-6" />,

      href: "/events?category=art-culture",
      color: "bg-purple-50 text-purple-600",
    },
    {
      name: "Game",
      icon: <GamepadIcon className="h-6 w-6" />,

      href: "/events?category=game",
      color: "bg-red-50 text-red-600",
    },
    {
      name: "Yoga",
      icon: <SunIcon className="h-6 w-6" />,

      href: "/events?category=yoga",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      name: "Festival",
      icon: <TentIcon className="h-6 w-6" />,

      href: "/events?category=festival",
      color: "bg-pink-50 text-pink-600",
    },
    {
      name: "Sports",
      icon: <HeartIcon className="h-6 w-6" />,

      href: "/events?category=sports",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      name: "Culture",
      icon: <GlobeIcon className="h-6 w-6" />,

      href: "/events?category=culture",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      name: "More",
      icon: <MoreHorizontalIcon className="h-6 w-6" />,

      href: "/events",
      color: "bg-gray-50 text-gray-600",
    },
  ];

  return (
    <div className={cn("py-12 md:py-16", className)}>
      <div className="container">
        {title && (
          <h2 className="mb-8 text-center text-2xl font-semibold md:text-3xl">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group flex flex-col items-center rounded-lg p-3 transition-all hover:bg-white hover:shadow-md"
            >
              <div
                className={cn(
                  "mb-2 flex h-12 w-12 items-center justify-center rounded-full",
                  category.color
                )}
              >
                {category.icon}
              </div>
              <span className="text-center text-sm font-medium">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
