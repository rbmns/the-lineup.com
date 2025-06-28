
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === '/';

  useScrollToTop();

  return (
    <div className="min-h-screen w-full bg-sand">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Main Content Area - flows naturally on sand background */}
        <div className="flex-1 w-full min-h-screen bg-sand flex flex-col">
          {/* Main content - add top padding only for non-home pages */}
          <main className={cn(
            "w-full flex-1 flex flex-col",
            !isHomePage && "pt-16", // Add top padding for non-home pages
            isMobile && "pb-20" // Add bottom padding on mobile for bottom nav
          )}>
            <div className="flex-1 flex flex-col">
              <Outlet />
            </div>
          </main>
          {!isMobile && <Footer />}
        </div>
      </div>

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
