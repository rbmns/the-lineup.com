
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: {currentDate}</p>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p>
            Welcome to the lineup. By using our service, you agree to these Terms of Service.
            Please read them carefully.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Using Our Service</h2>
          <p>
            You must follow any policies made available to you within the Service.
            You may use our Service only as permitted by law. We may suspend or stop providing our Service to you
            if you do not comply with our terms or policies or if we are investigating suspected misconduct.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your the lineup Account</h2>
          <p>
            You may need an account to use some of our Services. You are responsible for safeguarding your account,
            and for any activity that occurs through your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Privacy and Data Collection</h2>
          <p>
            Our Privacy Policy explains how we handle your personal data and protect your privacy when you use our Service. 
            By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
          </p>
          <p>
            We use tracking technologies including cookies to collect and store information about how you interact with our services. 
            These technologies help us analyze site traffic, personalize content, and optimize your experience.
          </p>
          <p>
            You can manage cookie preferences through our Cookie Consent banner or your browser settings. 
            Please note that disabling certain cookies may impact functionality of our service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Content in the Service</h2>
          <p>
            When you upload, submit, store, send or receive content to or through our Service, you give us a worldwide
            license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform,
            publicly display and distribute such content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violating any laws or regulations</li>
            <li>Infringing the intellectual property rights of others</li>
            <li>Submitting false or misleading information</li>
            <li>Uploading or transmitting viruses or malicious code</li>
            <li>Attempting to access, tamper with, or use non-public areas of the platform</li>
            <li>Harassing, threatening, or intimidating other users</li>
            <li>Circumventing, disabling, or interfering with security features</li>
            <li>Using automated systems to access our Service without authorization</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Third-Party Services</h2>
          <p>
            Our Service may contain links to third-party websites or services that are not owned or controlled by the lineup.
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any
            third-party websites or services. You acknowledge that we will not be liable for any claims attributable
            to any third-party websites or services.
          </p>
          <p>
            We use third-party analytics services such as Google Analytics to help us understand how users interact with our platform. 
            These services may collect information about your use of our service and may share this information with other services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Changes to These Terms</h2>
          <p>
            We may modify these terms or any additional terms that apply to a Service from time to time.
            We will provide reasonable advance notice of material modifications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: 
            <a href="mailto:legal@the-lineup.com" className="text-blue-600 hover:underline ml-1">
              legal@the-lineup.com
            </a>
          </p>
        </section>
      </div>

      <div className="pt-6">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
