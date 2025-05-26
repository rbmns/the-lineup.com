
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p>
            At the lineup, we respect your privacy and are committed to protecting your personal data under GDPR and other applicable privacy laws. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our service, including events, casual plans, and social features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <p>We collect information that you provide directly to us such as:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account information (name, email address, password)</li>
            <li>Profile information (username, profile picture, tagline, location)</li>
            <li>Event participation data (RSVPs, attendance)</li>
            <li>Casual plans data (plans you create, join, or interact with)</li>
            <li>Social interactions (friend connections, messages)</li>
            <li>Location data (when you share your location for events or plans)</li>
            <li>Usage analytics (via Google Analytics when consented)</li>
            <li>Communications with other users and support</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Enable event discovery and RSVP functionality</li>
            <li>Facilitate casual plans creation and participation</li>
            <li>Connect you with other users and enable social features</li>
            <li>Process and complete transactions</li>
            <li>Send you notifications about events and activities</li>
            <li>Provide customer support</li>
            <li>Monitor and analyze usage trends (with consent)</li>
            <li>Ensure platform safety and prevent abuse</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Legal Basis for Processing (GDPR)</h2>
          <p>We process your personal data based on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Contract:</strong> To provide our services (events, casual plans, social features)</li>
            <li><strong>Legitimate Interest:</strong> To improve our service and ensure platform safety</li>
            <li><strong>Consent:</strong> For analytics cookies and marketing communications</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. We may share information in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>With other users as part of social features (profiles, event attendance, casual plans)</li>
            <li>With your explicit consent</li>
            <li>To comply with laws or respond to lawful requests</li>
            <li>To protect the rights, property, and safety of our users</li>
            <li>With service providers who assist us (under strict data protection agreements)</li>
            <li>In connection with a merger, sale, or acquisition (with notice)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Cookies and Tracking</h2>
          <p>We use:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential cookies:</strong> Required for basic functionality</li>
            <li><strong>Analytics cookies:</strong> Google Analytics (with your consent) to understand usage patterns</li>
            <li><strong>Functional cookies:</strong> To remember your preferences</li>
          </ul>
          <p>You can manage your cookie preferences through our cookie banner or browser settings.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your Rights (GDPR & Beyond)</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate information</li>
            <li><strong>Erasure:</strong> Delete your personal data ("right to be forgotten")</li>
            <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
            <li><strong>Restriction:</strong> Limit how we process your data</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdraw consent:</strong> For activities based on consent</li>
            <li><strong>Lodge a complaint:</strong> With your local data protection authority</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data Security & Retention</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information.
            We retain your data only as long as necessary for the purposes outlined in this policy or as required by law.
            Account data is retained while your account is active and for a reasonable period after deletion to comply with legal obligations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">International Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries outside your residence, including the US.
            We ensure adequate protection through appropriate safeguards such as standard contractual clauses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact Us & Data Protection</h2>
          <p>
            For privacy-related questions, to exercise your rights, or to contact our Data Protection Officer:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: <a href="mailto:privacy@the-lineup.com" className="text-blue-600 hover:underline">privacy@the-lineup.com</a></li>
            <li>Data Protection Officer: <a href="mailto:dpo@the-lineup.com" className="text-blue-600 hover:underline">dpo@the-lineup.com</a></li>
          </ul>
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
