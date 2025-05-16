
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import Layout from "./components/Layout";
import Friends from "./pages/Friends";
import UserProfilePage from "./pages/UserProfilePage"; 
import ProfileEdit from "./pages/ProfileEdit";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import DesignSystem from "./pages/DesignSystem";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/events" replace />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
