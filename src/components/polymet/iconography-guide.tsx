import { cn } from "@/lib/utils";
import {
  ShapesIcon as WaveIcon,
  MusicIcon,
  SunIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UtensilsIcon,
  GlobeIcon,
  HeartIcon,
  StarIcon,
  CompassIcon,
  BellIcon,
  SearchIcon,
  PlusIcon,
  MessageCircleIcon,
  ShareIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

interface IconCategoryProps {
  title: string;
  description: string;
  icons: {
    icon: React.ReactNode;
    name: string;
    usage: string;
  }[];
  className?: string;
}

function IconCategory({
  title,
  description,
  icons,
  className,
}: IconCategoryProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="font-inter text-lg font-semibold">{title}</h3>
        <p className="text-sm text-ui-text-secondary-light">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg border border-ui-border-light bg-ui-card-light p-4 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-oceanDeep/10 text-primary-oceanDeep">
              {icon.icon}
            </div>
            <h4 className="mt-3 font-jetbrains-mono text-sm font-medium">
              {icon.name}
            </h4>
            <p className="mt-1 text-xs text-ui-text-secondary-light">
              {icon.usage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IconographyGuide() {
  const categoryIcons = [
    {
      icon: <WaveIcon className="h-6 w-6" />,

      name: "Wave",
      usage: "Surf events",
    },
    {
      icon: <MusicIcon className="h-6 w-6" />,

      name: "Music",
      usage: "Music events",
    },
    {
      icon: <SunIcon className="h-6 w-6" />,

      name: "Sun",
      usage: "Outdoor events",
    },
    {
      icon: <UsersIcon className="h-6 w-6" />,

      name: "Users",
      usage: "Community events",
    },
  ];

  const eventDetailIcons = [
    {
      icon: <MapPinIcon className="h-6 w-6" />,

      name: "Map Pin",
      usage: "Locations",
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,

      name: "Calendar",
      usage: "Dates & times",
    },
    {
      icon: <ShoppingBagIcon className="h-6 w-6" />,

      name: "Bag",
      usage: "Markets & shopping",
    },
    {
      icon: <UtensilsIcon className="h-6 w-6" />,

      name: "Utensils",
      usage: "Food events",
    },
  ];

  const navigationIcons = [
    {
      icon: <GlobeIcon className="h-6 w-6" />,

      name: "Globe",
      usage: "Explore/discover",
    },
    {
      icon: <HeartIcon className="h-6 w-6" />,

      name: "Heart",
      usage: "Favorites",
    },
    {
      icon: <StarIcon className="h-6 w-6" />,

      name: "Star",
      usage: "Featured content",
    },
    {
      icon: <CompassIcon className="h-6 w-6" />,

      name: "Compass",
      usage: "Navigation",
    },
  ];

  const uiIcons = [
    {
      icon: <BellIcon className="h-6 w-6" />,

      name: "Bell",
      usage: "Notifications",
    },
    {
      icon: <SearchIcon className="h-6 w-6" />,

      name: "Search",
      usage: "Search functionality",
    },
    {
      icon: <PlusIcon className="h-6 w-6" />,

      name: "Plus",
      usage: "Add new content",
    },
    {
      icon: <MessageCircleIcon className="h-6 w-6" />,

      name: "Message",
      usage: "Comments/chat",
    },
    {
      icon: <ShareIcon className="h-6 w-6" />,

      name: "Share",
      usage: "Share content",
    },
    {
      icon: <UserIcon className="h-6 w-6" />,

      name: "User",
      usage: "Profile",
    },
    {
      icon: <SettingsIcon className="h-6 w-6" />,

      name: "Settings",
      usage: "App settings",
    },
    {
      icon: <LogOutIcon className="h-6 w-6" />,

      name: "Log Out",
      usage: "Sign out",
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-inter text-2xl font-semibold">
          Iconography Guidelines
        </h2>
        <p className="mt-2 text-ui-text-secondary-light">
          The lineup uses Lucide icons with consistent styling to maintain
          visual harmony across the platform. Icons should be simple,
          recognizable, and used consistently.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-jetbrains-mono text-sm uppercase tracking-wider text-primary-oceanDeep">
          Icon Style Guidelines
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2 text-primary-oceanDeep">•</span>
            <span>
              <strong>Stroke width:</strong> Use consistent 2px stroke width for
              all icons
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary-oceanDeep">•</span>
            <span>
              <strong>Size:</strong> Standard sizes are 16px (small), 20px
              (medium), and 24px (large)
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary-oceanDeep">•</span>
            <span>
              <strong>Color:</strong> Use brand colors consistently - primary
              for active states, muted for inactive
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary-oceanDeep">•</span>
            <span>
              <strong>Background:</strong> For icon buttons, use subtle
              backgrounds with proper contrast
            </span>
          </li>
        </ul>
      </div>

      <IconCategory
        title="Category Icons"
        description="Icons used to represent different event categories"
        icons={categoryIcons}
      />

      <IconCategory
        title="Event Detail Icons"
        description="Icons used to display event information and details"
        icons={eventDetailIcons}
      />

      <IconCategory
        title="Navigation Icons"
        description="Icons used in navigation and discovery features"
        icons={navigationIcons}
      />

      <IconCategory
        title="UI & Interaction Icons"
        description="Icons used for user interface elements and interactions"
        icons={uiIcons}
      />

      <div className="rounded-lg border border-ui-border-light bg-ui-card-light p-6">
        <h3 className="font-inter text-lg font-semibold">
          Icon Usage Examples
        </h3>

        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-jetbrains-mono text-sm uppercase tracking-wider text-primary-oceanDeep">
              Button with Icon
            </h4>
            <div className="mt-2 flex items-center gap-4">
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-oceanDeep px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-oceanDeep/90">
                <PlusIcon className="h-4 w-4" />

                <span>Create Event</span>
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-oceanDeep bg-transparent px-4 py-2 text-sm font-medium text-primary-oceanDeep transition-colors hover:bg-primary-oceanDeep/10">
                <ShareIcon className="h-4 w-4" />

                <span>Share</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-jetbrains-mono text-sm uppercase tracking-wider text-primary-oceanDeep">
              Icon with Text
            </h4>
            <div className="mt-2 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-primary-oceanDeep" />

                <span>June 24, 2023</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-primary-oceanDeep" />

                <span>Zandvoort Beach</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4 text-primary-oceanDeep" />

                <span>24 attending</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-jetbrains-mono text-sm uppercase tracking-wider text-primary-oceanDeep">
              Icon Buttons
            </h4>
            <div className="mt-2 flex gap-3">
              <button className="rounded-full bg-primary-oceanDeep/10 p-2 text-primary-oceanDeep hover:bg-primary-oceanDeep/20">
                <HeartIcon className="h-5 w-5" />
              </button>

              <button className="rounded-full bg-primary-oceanDeep/10 p-2 text-primary-oceanDeep hover:bg-primary-oceanDeep/20">
                <ShareIcon className="h-5 w-5" />
              </button>

              <button className="rounded-full bg-primary-oceanDeep/10 p-2 text-primary-oceanDeep hover:bg-primary-oceanDeep/20">
                <MessageCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
