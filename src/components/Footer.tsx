
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-600">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} the lineup. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-5">
              <Link to="/privacy" className="hover:text-gray-900 transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-900 transition">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-gray-900 transition">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* HumbleStudio attribution on its own row */}
          <div className="flex justify-center pt-2 border-t border-gray-100">
            <a 
              href="https://humblestudio.ai/?utm_source=thelineup&utm_medium=footer&utm_campaign=madebylabel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
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
