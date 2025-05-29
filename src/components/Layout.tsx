
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [user, loading, navigate, location]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
