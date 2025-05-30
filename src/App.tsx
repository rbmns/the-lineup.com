
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient } from "./components/query-client";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import EventsPage from "./pages/EventsPage";
import CreateEvent from "./pages/events/create";
import EventDetail from "./pages/EventDetail";
import EditEvent from "./pages/events/[eventId]/edit";
import CasualPlansPage from "./pages/CasualPlans";
import FriendsPage from "./pages/Friends";
import MapPage from "./pages/map";
import ProfilePage from "./pages/Profile";
import UserProfilePage from "./pages/UserProfilePage";
import ProfileEdit from "./pages/ProfileEdit";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import GoodbyePage from "./pages/GoodbyePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import EventCategoriesStyleGuide from "./components/design-system/EventCategoriesStyleGuide";
import CreateCasualPlanPage from '@/components/casual-plans/CreateCasualPlanPage';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              
              {/* Public Events routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetail />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/goodbye" element={<GoodbyePage />} />
              
              {/* Legal pages */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              
              {/* Protected routes (require authentication) */}
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:eventId/edit" element={<EditEvent />} />
              <Route path="/casual-plans" element={<CasualPlansPage />} />
              <Route path="/casual-plans/create" element={<CreateCasualPlanPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/profile/:username" element={<UserProfilePage />} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
              
              {/* Design system routes */}
              <Route path="/style-guide" element={<EventCategoriesStyleGuide />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
