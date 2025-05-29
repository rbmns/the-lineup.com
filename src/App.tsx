
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient } from "./components/query-client";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import EventsPage from "./pages/EventsPage";
import CreateEvent from "./pages/events/create";
import EventDetail from "./pages/EventDetail";
import EditEvent from "./pages/events/[eventId]/edit";
import CasualPlansPage from "./pages/CasualPlans";
import FriendsPage from "./pages/Friends";
import MapPage from "./pages/map";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
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
              <Route index element={<Index />} />
              
              {/* Public Events routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes (require authentication) */}
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:eventId/edit" element={<EditEvent />} />
              <Route path="/casual-plans" element={<CasualPlansPage />} />
              <Route path="/casual-plans/create" element={<CreateCasualPlanPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              
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
