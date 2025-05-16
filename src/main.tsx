
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App.tsx'
import './index.css'
import { trackPageView } from './utils/analytics'

// PageViewTracker component to track page views on route changes
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

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
