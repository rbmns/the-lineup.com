
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App.tsx'
import './index.css'
import { trackPageView as trackAnalyticsPageView } from './utils/analytics'
import { initializeDataLayer, trackPageView as trackGtmPageView } from './utils/gtm'

// PageViewTracker component to track page views on route changes
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track in our custom analytics system
    trackAnalyticsPageView(location.pathname + location.search);
    
    // Also track in GTM
    trackGtmPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

// Initialize GTM dataLayer
initializeDataLayer();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PageViewTracker />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
