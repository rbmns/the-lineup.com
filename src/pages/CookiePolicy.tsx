
import React from 'react';
import { Helmet } from 'react-helmet-async';

const CookiePolicy: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>Cookie Policy | the lineup</title>
        <meta name="description" content="Cookie Policy for the lineup" />
      </Helmet>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our platform.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">What Are Cookies</h2>
        <p className="text-base leading-7 mb-6">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">How We Use Cookies</h2>
        <p className="text-base leading-7 mb-6">
          We use cookies to improve your experience, analyze our traffic, and provide social media features.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Google Tag Manager</h2>
        <p className="text-base leading-7 mb-6">
          We use Google Tag Manager to manage tracking scripts and analytics. This helps us understand how users interact with our site while respecting your privacy preferences.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Your Choices</h2>
        <p className="text-base leading-7 mb-6">
          You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Contact Us</h2>
        <p className="text-base leading-7">
          If you have any questions about our use of cookies, please contact us at privacy@the-lineup.com.
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
