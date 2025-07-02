
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-coconut border-t border-ocean-deep/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col space-y-6">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
            <div className="mb-4 md:mb-0">
              <p className="text-ocean-deep">&copy; {currentYear} the lineup. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/privacy" 
                className="text-ocean-deep/70 hover:text-ocean-deep transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-ocean-deep/70 hover:text-ocean-deep transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-ocean-deep/70 hover:text-ocean-deep transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <a 
                href="https://www.instagram.com/yourlocallineup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ocean-deep/70 hover:text-ocean-deep transition-colors duration-200"
              >
                Follow for updates
              </a>
            </div>
          </div>
          
          {/* HumbleStudio attribution */}
          <div className="flex justify-center pt-4 border-t border-ocean-deep/10">
            <a 
              href="https://humblestudio.ai/?utm_source=thelineup&utm_medium=footer&utm_campaign=madebylabel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="https://raw.githubusercontent.com/rbmns/images/refs/heads/main/hs/promo/byHumbleStudioi.ai.png" 
                alt="Made by HumbleStudio.ai" 
                className="h-12"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
