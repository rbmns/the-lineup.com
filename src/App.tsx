
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
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="events" element={<EventsPageRefactored />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="casual-plans" element={<CasualPlans />} />
              <Route path="friends" element={<Friends />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<ProfileEdit />} />
              <Route path="profile/settings" element={<ProfileSettings />} />
              <Route path="users/:username" element={<UserProfile />} />
              <Route path="explore" element={<Explore />} />
              <Route path="home" element={<Home />} />
              <Route path="venues/:slug" element={<VenueEvents />} />
              <Route path="categories/:category" element={<CategoryFilteredEventsPage />} />
              <Route path="admin" element={<Admin />} />
              <Route path="admin/settings" element={<AdminSettings />} />
              <Route path="design-system" element={<DesignSystem />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
            
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
