
import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>Privacy Policy | the lineup</title>
        <meta name="description" content="Privacy Policy for the lineup" />
      </Helmet>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Information We Collect</h2>
        <p className="text-base leading-7 mb-6">
          We collect information you provide directly to us, such as when you create an account, update your profile, or contact us.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">How We Use Your Information</h2>
        <p className="text-base leading-7 mb-6">
          We use the information we collect to provide, maintain, and improve our services, and to communicate with you.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Contact Us</h2>
        <p className="text-base leading-7">
          If you have any questions about this Privacy Policy, please contact us at privacy@the-lineup.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
