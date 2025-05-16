import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
    } else if (hasConsented === 'true') {
      // Enable analytics if consent was given
      enableAnalytics();
    }
  }, []);

  // Function to enable Google Analytics
  const enableAnalytics = () => {
    // This enables GTM/GA tracking after user has consented
    // The dataLayer object should have already been created by the GTM script
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'cookie_consent_given',
        'consent_granted': true
      });
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
    enableAnalytics();
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowConsent(false);
    // Disable analytics tracking
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'cookie_consent_declined',
        'consent_granted': false
      });
    }
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
      aria-labelledby="cookie-consent-title"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
        <div className="flex-1 pr-2 md:pr-4">
          <h3 id="cookie-consent-title" className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base">Cookie and Privacy Notice</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 leading-tight">
            We use cookies and similar technologies to enhance your experience, analyze our traffic, and personalize content and ads.
            By clicking "Accept All", you consent to the use of Google Analytics and other tracking tools. 
            Read our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> and <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> for more information.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={declineCookies}
            className="whitespace-nowrap text-xs h-7 md:h-8"
          >
            Necessary Only
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
