
import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>Terms of Service | the lineup</title>
        <meta name="description" content="Terms of Service for the lineup" />
      </Helmet>
      
      <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          These Terms of Service govern your use of our platform and services.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Acceptance of Terms</h2>
        <p className="text-base leading-7 mb-6">
          By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">User Responsibilities</h2>
        <p className="text-base leading-7 mb-6">
          You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
        </p>
        
        <h2 className="text-3xl font-semibold tracking-tight mb-4">Contact Us</h2>
        <p className="text-base leading-7">
          If you have any questions about these Terms of Service, please contact us at legal@the-lineup.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
