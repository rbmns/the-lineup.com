
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
    <div className="min-h-screen w-full bg-pure-white flex flex-col">
      <MainNav />
      
      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <main className={cn(
          "w-full flex-1 flex flex-col min-h-screen",
          !isHomePage && "page-content-offset", // Use global class for top padding
          isMobile && "pb-20" // Add bottom padding on mobile for bottom nav
        )}>
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
        {!isMobile && <Footer />}
      </div>

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
