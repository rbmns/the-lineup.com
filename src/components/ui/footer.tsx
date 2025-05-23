
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-2 md:mb-0">
            <p>&copy; {currentYear} the lineup. All rights reserved.</p>
          </div>
          <div className="flex justify-left">
            <a 
              href="https://humblestudio.ai/?utm_source=thelineup&utm_medium=footer&utm_campaign=madebylabel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://res.cloudinary.com/dita7stkt/image/upload/v1747993915/MadeByHS_kry9in.png" 
                alt="Made by HumbleStudio.ai" 
                className="h-14"
              />
            </a>
          </div>
          <div className="flex space-x-5">
            <Link to="/privacy" className="hover:text-gray-900 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-900 transition">
              Terms of Service
            </Link>
            <a href="mailto:contact@the-lineup.com" className="hover:text-gray-900 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
