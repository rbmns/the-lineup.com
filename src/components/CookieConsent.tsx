
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user has already made a cookie choice
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Show banner after a slight delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Apply previous consent choice
      const consentValue = hasConsented === 'true';
      updateGoogleConsent(consentValue);
    }
  }, []);

  const updateGoogleConsent = (hasConsented: boolean) => {
    // Update Google Tag Manager consent mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': hasConsented ? 'granted' : 'denied',
        'ad_storage': hasConsented ? 'granted' : 'denied',
        'ad_user_data': hasConsented ? 'granted' : 'denied',
        'ad_personalization': hasConsented ? 'granted' : 'denied',
        'functionality_storage': 'granted', // Always allow functional cookies
        'security_storage': 'granted', // Always allow security cookies
      });
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    updateGoogleConsent(true);
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    updateGoogleConsent(false);
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div 
      className="fixed bottom-0 inset-x-0 z-50 bg-gray-100 border-t border-gray-200 shadow-lg"
      style={{ 
        padding: isMobile ? '0.75rem' : '1.5rem',
        pointerEvents: 'auto' 
      }}
      aria-live="polite"
      role="dialog"
      aria-modal="false"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
        <div className="flex-1 pr-2 md:pr-4">
          <h3 className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base">Cookie & Privacy Notice</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 leading-tight">
            We use essential cookies for functionality and optional analytics cookies (Google Analytics & Tag Manager) to improve our service. 
            We also collect data for casual plans features and user interactions. 
            By clicking "Accept All", you consent to all cookies and data processing. 
            Read our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>, and <Link to="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link> for details on how we handle your data.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={declineCookies}
            className="whitespace-nowrap text-xs h-7 md:h-8"
          >
            Essential Only
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={acceptCookies}
            className="whitespace-nowrap text-xs h-7 md:h-8"
          >
            Accept All
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={declineCookies}
            className="absolute top-1 right-1 h-6 w-6 sm:hidden"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
