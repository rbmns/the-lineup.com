import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BellIcon,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/polymet/components/button";

interface UserAvatarMenuProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  notificationCount?: number;
}

export default function UserAvatarMenu({
  user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://github.com/yusufhilmi.png",
  },
  onLogout,
  notificationCount = 0,
}: UserAvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem("isLoggedIn");
    }
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const hasNotifications = notificationCount > 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />

            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-vibrant-teal text-[10px] font-medium text-white">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-primary-75">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex w-full cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />

              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/friends" className="flex w-full cursor-pointer">
              <UsersIcon className="mr-2 h-4 w-4" />

              <span>Friends</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/profile?tab=events"
              className="flex w-full cursor-pointer"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />

              <span>My Events</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {hasNotifications && (
          <DropdownMenuItem asChild>
            <Link to="/notifications" className="flex w-full cursor-pointer">
              <BellIcon className="mr-2 h-4 w-4" />

              <span>Notifications</span>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-vibrant-teal text-[10px] font-medium text-white">
                {notificationCount}
              </span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link
            to="/profile?tab=settings"
            className="flex w-full cursor-pointer"
          >
            <SettingsIcon className="mr-2 h-4 w-4" />

            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />

          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
