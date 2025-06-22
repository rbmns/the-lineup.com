
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gradient-to-t from-secondary-25 to-white border-t border-primary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col space-y-6">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
            <div className="mb-4 md:mb-0">
              <p className="text-primary font-medium">&copy; {currentYear} the lineup. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/privacy" 
                className="text-neutral hover:text-primary transition-colors duration-200 font-medium"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-neutral hover:text-primary transition-colors duration-200 font-medium"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-neutral hover:text-primary transition-colors duration-200 font-medium"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* HumbleStudio attribution */}
          <div className="flex justify-center pt-4 border-t border-primary/10">
            <a 
              href="https://humblestudio.ai/?utm_source=thelineup&utm_medium=footer&utm_campaign=madebylabel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200 hover:scale-105 transform"
            >
              <img 
                src="https://res.cloudinary.com/dita7stkt/image/upload/v1747993915/MadeByHS_kry9in.png" 
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
