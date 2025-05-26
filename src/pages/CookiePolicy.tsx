
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">What Are Cookies</h2>
          <p className="text-base leading-7">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
            They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">How We Use Cookies</h2>
          <p className="text-base leading-7">
            We use cookies to enhance your experience on the lineup, including for events discovery, casual plans, and social features. 
            Here's how we categorize our cookie usage:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Types of Cookies We Use</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">Essential Cookies (Always Active)</h3>
              <p className="text-base leading-7">
                These cookies are necessary for the website to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base leading-7">
                <li>User authentication and login sessions</li>
                <li>Security and fraud prevention</li>
                <li>Basic website functionality</li>
                <li>Remembering your cookie preferences</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Legal basis:</strong> Necessary for contract performance and legitimate interests
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold">Functional Cookies</h3>
              <p className="text-base leading-7">
                These cookies enhance your experience by remembering your preferences:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base leading-7">
                <li>Language and region preferences</li>
                <li>Event filter settings</li>
                <li>Display preferences (dark/light mode)</li>
                <li>Location settings for event discovery</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Legal basis:</strong> Legitimate interests
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold">Analytics Cookies (Requires Consent)</h3>
              <p className="text-base leading-7">
                We use Google Analytics and Google Tag Manager to understand how visitors interact with our website:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base leading-7">
                <li><strong>Google Analytics:</strong> Tracks page views, user journeys, and website performance</li>
                <li><strong>Google Tag Manager:</strong> Manages tracking codes and conversion measurements</li>
                <li>Event interaction analytics (which events are viewed, RSVPs)</li>
                <li>Casual plans engagement metrics</li>
                <li>Social feature usage patterns</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Legal basis:</strong> Consent (you can withdraw this at any time)
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Data retention:</strong> Google Analytics data is retained for 26 months
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Google Consent Mode</h2>
          <p className="text-base leading-7">
            We implement Google Consent Mode v2, which allows us to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base leading-7">
            <li>Respect your cookie preferences for Google services</li>
            <li>Adjust Google Analytics behavior based on your consent</li>
            <li>Provide aggregate, privacy-friendly insights when consent is denied</li>
            <li>Ensure compliance with privacy regulations like GDPR</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Third-Party Cookies</h2>
          <p className="text-base leading-7">
            Our website may contain links to third-party services that may set their own cookies:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base leading-7">
            <li><strong>Google Services:</strong> Analytics, Maps (for event locations)</li>
            <li><strong>Social Media:</strong> When sharing events or casual plans</li>
            <li><strong>Payment Providers:</strong> For paid events (if applicable)</li>
          </ul>
          <p className="text-base leading-7">
            We do not control these third-party cookies. Please refer to their respective privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Managing Your Cookie Preferences</h2>
          <p className="text-base leading-7">You have several options to control cookies:</p>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-medium">On Our Website</h3>
              <p className="text-base leading-7">
                You can change your cookie preferences at any time by clicking the cookie settings in our banner 
                or by managing your preferences in your browser settings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium">Browser Settings</h3>
              <p className="text-base leading-7">
                Most browsers allow you to control cookies through their settings preferences. You can:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base leading-7">
                <li>Block all cookies</li>
                <li>Allow only first-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Set cookies to be deleted when you close your browser</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium">Google Analytics Opt-out</h3>
              <p className="text-base leading-7">
                You can opt out of Google Analytics by installing the 
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Impact of Disabling Cookies</h2>
          <p className="text-base leading-7">
            If you choose to disable cookies, some features of our website may not function properly:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base leading-7">
            <li>You may need to log in repeatedly</li>
            <li>Your preferences may not be saved</li>
            <li>Some personalization features may be unavailable</li>
            <li>Event recommendations may be less relevant</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Updates to This Policy</h2>
          <p className="text-base leading-7">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page 
            with an updated revision date. For significant changes, we may provide additional notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Contact Us</h2>
          <p className="text-base leading-7">
            If you have questions about our use of cookies, please contact us at:
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
