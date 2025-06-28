
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const TOP_NAV_HEIGHT = 60;
const MOBILE_BOTTOM_NAV_HEIGHT = 80;

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
        <div
          className="flex-1 w-full min-h-screen bg-sand flex flex-col"
          style={
            !isMobile
              ? {
                  paddingTop: TOP_NAV_HEIGHT,
                  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
                }
              : {
                  paddingTop: TOP_NAV_HEIGHT,
                  paddingBottom: MOBILE_BOTTOM_NAV_HEIGHT,
                  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT + MOBILE_BOTTOM_NAV_HEIGHT}px)`,
                }
          }
        >
          {/* Main content - flows naturally without page wrappers */}
          <main className="w-full flex-1 flex flex-col">
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
