
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EventsPageRefactored from "./pages/EventsPageRefactored";
import EventDetail from "./pages/EventDetail";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import Friends from "./pages/Friends";
import UserProfilePage from "./pages/UserProfilePage";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./contexts/ToastContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/" element={<Layout />}>
            <Route path="/events" element={<EventsPageRefactored />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<EventsPageRefactored />} />
          </Route>
        </Routes>
        <Toaster />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
