
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Terms of Service | the lineup</title>
        <meta name="description" content="Terms of Service for the lineup" />
      </Helmet>
      
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none bg-white rounded-lg p-8 shadow-sm">
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            These Terms of Service govern your use of our platform and services.
          </p>
          
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Acceptance of Terms</h2>
          <p className="text-base leading-7 mb-6">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2 className="text-3xl font-semibold tracking-tight mb-4">User Responsibilities</h2>
          <p className="text-base leading-7 mb-6">
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.
          </p>
          
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Prohibited Uses</h2>
          <p className="text-base leading-7 mb-6">
            You may not use our service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction when using our service.
          </p>
          
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Service Availability</h2>
          <p className="text-base leading-7 mb-6">
            We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
          </p>
          
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Contact Us</h2>
          <p className="text-base leading-7">
            If you have any questions about these Terms of Service, please contact us at legal@the-lineup.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
