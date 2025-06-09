
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { SocialSidebar } from "@/components/social/SocialSidebar";

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!rightSidebarVisible);
  };

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Fixed Navigation - Always at top */}
      <MainNav />
      
      {/* Main Layout Container */}
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only */}
        {!isMobile && (
          <div className="fixed left-0 top-16 bottom-0 w-20 bg-white z-30">
            <LeftSidebar />
          </div>
        )}
        
        {/* Main Content Area - Remove all padding */}
        <div 
          className={`flex-1 w-full min-h-screen ${
            isMobile 
              ? 'pt-16 pb-20' // Mobile: only nav spacing
              : rightSidebarVisible 
                ? 'pt-16 pl-20 pr-56' // Desktop with narrower right sidebar
                : 'pt-16 pl-20' // Desktop without right sidebar
          }`}
        >
          <main className="bg-white w-full min-h-full"> {/* Completely remove padding/margin */}
            <Outlet />
          </main>
          
          {/* Footer - Desktop only */}
          {!isMobile && <Footer />}
        </div>

        {/* Right Social Sidebar - Desktop only, made even narrower */}
        {!isMobile && (
          <div className="fixed right-0 top-16 bottom-0 w-56 z-30"> {/* Further reduced from w-64 to w-56 */}
            <SocialSidebar 
              visible={rightSidebarVisible}
              onToggleVisibility={toggleRightSidebar}
            />
          </div>
        )}
      </div>

      {/* Mobile Navigation - Fixed to bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white z-50 safe-area-pb">
          <LeftSidebar />
        </div>
      )}

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
