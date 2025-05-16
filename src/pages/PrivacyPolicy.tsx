
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: {currentDate}</p>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p>
            At the lineup, we respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <p>We collect information that you provide directly to us such as:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account information (name, email address, password)</li>
            <li>Profile information (username, profile picture)</li>
            <li>Location data (when you share your location)</li>
            <li>Event participation data</li>
            <li>Communications with other users</li>
          </ul>
          <p className="mt-3">We also automatically collect certain information when you visit, use, or navigate our platform, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Usage data (pages visited, time spent, referring pages)</li>
            <li>Device information (browser type, operating system, device type)</li>
            <li>IP address and approximate location based on IP</li>
            <li>Cookie and tracking technology data</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, and similar technologies to enhance your experience, analyze our traffic, and provide targeted advertising. These technologies may collect information about your online activities over time and across websites.
          </p>
          <p>
            <strong>Analytics:</strong> We use Google Analytics and our own analytics system to understand how our users interact with our platform. Google Analytics may use cookies to collect information about your browsing patterns.
          </p>
          <p>
            You can opt-out of our tracking technologies at any time by clicking the "Necessary Only" button on our cookie consent banner or by adjusting your browser settings to reject cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Connect you with other users and events</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Personalize your experience and deliver content relevant to your interests</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data Sharing and Disclosure</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy.
            We may share information in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>With your consent</li>
            <li>To comply with laws or respond to lawful requests</li>
            <li>To protect the rights, property, and safety of our users</li>
            <li>With service providers who help us operate our platform (including analytics providers)</li>
            <li>In connection with a merger, sale, or acquisition</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Third-Party Analytics</h2>
          <p>
            We use Google Analytics to help us understand how our users use the site. Google Analytics uses cookies and similar technologies to collect information about your use of the website and may transfer this information to third parties where required to do so by law, or where such third parties process the information on Google's behalf.
          </p>
          <p>
            To learn more about how Google uses data when you use our site, visit <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google's Privacy Policy</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Object to processing of your information</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Children's Privacy</h2>
          <p>
            Our service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we learn we have collected personal information from a child under 16, we will delete that information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: 
            <a href="mailto:privacy@the-lineup.com" className="text-blue-600 hover:underline ml-1">
              privacy@the-lineup.com
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
