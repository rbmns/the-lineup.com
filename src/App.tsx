
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

// Import pages
import Index from "./pages/Index";
import EventsPageRefactored from "./pages/EventsPageRefactored";
import EventDetail from "./pages/EventDetail";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import ProfileEdit from "./pages/ProfileEdit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import GoodbyePage from "./pages/GoodbyePage";
import ProfileSettings from "./pages/ProfileSettings";
import Admin from "./pages/Admin";
import AdminSettings from "./pages/AdminSettings";
import VenueEvents from "./pages/VenueEvents";
import CategoryFilteredEventsPage from "./pages/CategoryFilteredEventsPage";
import CasualPlans from "./pages/CasualPlans";
import DesignSystem from "./pages/DesignSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/events" element={<Layout><EventsPageRefactored /></Layout>} />
            <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
            <Route path="/casual-plans" element={<Layout><CasualPlans /></Layout>} />
            <Route path="/friends" element={<Layout><Friends /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/profile/edit" element={<Layout><ProfileEdit /></Layout>} />
            <Route path="/profile/settings" element={<Layout><ProfileSettings /></Layout>} />
            <Route path="/users/:username" element={<Layout><UserProfile /></Layout>} />
            <Route path="/explore" element={<Layout><Explore /></Layout>} />
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/venues/:slug" element={<Layout><VenueEvents /></Layout>} />
            <Route path="/categories/:category" element={<Layout><CategoryFilteredEventsPage /></Layout>} />
            <Route path="/admin" element={<Layout><Admin /></Layout>} />
            <Route path="/admin/settings" element={<Layout><AdminSettings /></Layout>} />
            <Route path="/design-system" element={<Layout><DesignSystem /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/signup" element={<Layout><Signup /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
            
            {/* Routes without layout */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/goodbye" element={<GoodbyePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
