
import React from 'react';
import { Helmet } from 'react-helmet-async';

const CookiePolicy: React.FC = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Helmet>
        <title>Cookie Policy | the lineup</title>
        <meta name="description" content="Cookie Policy for the lineup" />
      </Helmet>
      
      {/* Full-width header section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="w-full px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-center">Cookie Policy</h1>
          </div>
        </div>
      </div>

      <div className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none bg-white rounded-lg p-8 shadow-sm">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our platform.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">What Are Cookies</h2>
            <p className="text-base leading-7 mb-6">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">How We Use Cookies</h2>
            <p className="text-base leading-7 mb-6">
              We use cookies to improve your experience, analyze our traffic, provide social media features, and remember your preferences. The cookies we use fall into the following categories:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Social Media Cookies:</strong> Enable social media features and functionality</li>
            </ul>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Google Tag Manager</h2>
            <p className="text-base leading-7 mb-6">
              We use Google Tag Manager to manage tracking scripts and analytics. This helps us understand how users interact with our site while respecting your privacy preferences.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Your Cookie Choices</h2>
            <p className="text-base leading-7 mb-6">
              You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience and some features of our website may not function properly.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Third-Party Cookies</h2>
            <p className="text-base leading-7 mb-6">
              Some cookies on our site are set by third-party services. We have no control over these cookies and you should check the relevant third party's website for more information.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Contact Us</h2>
            <p className="text-base leading-7">
              If you have any questions about our use of cookies, please contact us at privacy@the-lineup.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
