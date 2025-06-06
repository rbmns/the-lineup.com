
import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full bg-gray-50">
      <Helmet>
        <title>Privacy Policy | the lineup</title>
        <meta name="description" content="Privacy Policy for the lineup" />
      </Helmet>
      
      {/* Full-width header section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="w-full px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-center">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="w-full py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none bg-white rounded-lg p-8 shadow-sm">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use the lineup platform.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Information We Collect</h2>
            <p className="text-base leading-7 mb-6">
              We collect information you provide directly to us, such as when you create an account, update your profile, RSVP to events, or contact us. This may include your name, email address, location, and profile information.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">How We Use Your Information</h2>
            <p className="text-base leading-7 mb-6">
              We use the information we collect to provide, maintain, and improve our services, including to show you relevant events, connect you with friends, and communicate with you about our services.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Your Rights (GDPR Compliance)</h2>
            <p className="text-base leading-7 mb-4">
              Under the General Data Protection Regulation (GDPR), you have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification (correction) of your data</li>
              <li>Right to erasure (deletion) of your data</li>
              <li>Right to restrict processing of your data</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent at any time</li>
            </ul>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Data Sharing</h2>
            <p className="text-base leading-7 mb-6">
              We do not sell your personal information. We may share your information only in specific circumstances, such as with your explicit consent or as required by law.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Data Security</h2>
            <p className="text-base leading-7 mb-6">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Contact Us</h2>
            <p className="text-base leading-7">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at privacy@the-lineup.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
