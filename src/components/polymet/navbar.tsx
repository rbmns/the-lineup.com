import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/polymet/components/button";
import Logo from "@/polymet/components/logo";
import UserAvatarMenu from "@/polymet/components/user-avatar-menu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock authentication state - in a real app, this would come from an auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Toggle authentication for demo purposes
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  // Handle scroll events to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-secondary-50 dark:bg-primary-950/90 dark:border-primary-800"
          : "bg-white dark:bg-primary-950"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-neutral hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/events"
            className="px-3 py-2 text-sm font-medium text-neutral hover:text-primary"
          >
            Events
          </Link>
          <Link
            to="/plans"
            className="px-3 py-2 text-sm font-medium text-neutral hover:text-primary"
          >
            Plans
          </Link>
          <Link
            to="/friends"
            className="px-3 py-2 text-sm font-medium text-neutral hover:text-primary"
          >
            Friends
          </Link>
        </nav>

        {/* Auth buttons or user menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <UserAvatarMenu
              user={{
                name: "Alex Johnson",
                email: "alex@example.com",
                avatar: "https://github.com/yusufhilmi.png",
              }}
              notificationCount={2}
              onLogout={toggleAuth}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={toggleAuth} // For demo purposes
              >
                <Link to="/auth">Log in</Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
                onClick={toggleAuth} // For demo purposes
              >
                <Link to="/auth?tab=signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-neutral"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-secondary-50 dark:border-primary-800">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-neutral hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 text-base font-medium text-neutral hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/plans"
              className="block px-3 py-2 text-base font-medium text-neutral hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Plans
            </Link>
            <Link
              to="/friends"
              className="block px-3 py-2 text-base font-medium text-neutral hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Friends
            </Link>

            {/* Mobile auth buttons */}
            <div className="mt-4 pt-4 border-t border-secondary-50 dark:border-primary-800">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <img
                    src="https://github.com/yusufhilmi.png"
                    alt="User"
                    className="h-8 w-8 rounded-full mr-3"
                  />

                  <div>
                    <p className="text-sm font-medium">Alex Johnson</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-vibrant-sunset"
                      onClick={() => {
                        toggleAuth();
                        setIsMenuOpen(false);
                      }}
                    >
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toggleAuth();
                      setIsMenuOpen(false);
                    }}
                    asChild
                  >
                    <Link to="/auth">Log in</Link>
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      toggleAuth();
                      setIsMenuOpen(false);
                    }}
                    asChild
                  >
                    <Link to="/auth?tab=signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
