
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import EventDetail from './pages/EventDetail';
import EventsPageRefactored from './pages/EventsPageRefactored';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<EventsPageRefactored />} />
              <Route path="/events" element={<EventsPageRefactored />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              
              {/* Not Found Route - fallback for all other routes */}
              <Route path="*" element={<EventsPageRefactored />} />
            </Routes>
          </main>
          <Toaster />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
