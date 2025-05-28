import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient } from "./components/query-client";
import Layout from "./components/layout";
import Index from "./pages";
import EventsPage from "./pages/events";
import CreateEvent from "./pages/events/create";
import EventDetail from "./pages/events/[eventId]";
import EditEvent from "./pages/events/[eventId]/edit";
import CasualPlansPage from "./pages/casual-plans";
import FriendsPage from "./pages/friends";
import MapPage from "./pages/map";
import ProfilePage from "./pages/profile";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import EventCategoriesStyleGuide from "./components/design-system/EventCategoriesStyleGuide";
import CreateCasualPlanPage from '@/components/casual-plans/CreateCasualPlanPage';

function App() {
  return (
    <QueryClient>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            
            {/* Events routes */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events/:eventId/edit" element={<EditEvent />} />
            
            {/* Casual Plans routes */}
            <Route path="/casual-plans" element={<CasualPlansPage />} />
            <Route path="/casual-plans/create" element={<CreateCasualPlanPage />} />
            
            {/* Other routes */}
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Design system routes */}
            <Route path="/style-guide" element={<EventCategoriesStyleGuide />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
