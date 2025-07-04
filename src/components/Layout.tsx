
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
    <div className="min-h-screen w-full bg-pure-white overflow-x-hidden">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 w-full min-h-screen bg-pure-white flex flex-col overflow-x-hidden">
          {/* Main content with consistent padding system */}
          <main className={cn(
            "w-full flex-1 flex flex-col overflow-x-hidden",
            !isHomePage && "pt-16", // Add top padding for non-home pages
            isMobile && "pb-20" // Add bottom padding on mobile for bottom nav
          )}>
            <div className="flex-1 flex flex-col w-full overflow-x-hidden">
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
