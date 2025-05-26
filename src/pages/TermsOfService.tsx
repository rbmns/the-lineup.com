
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p>
            Welcome to the lineup. By using our service, including events discovery, casual plans, and social features, you agree to these Terms of Service.
            Please read them carefully.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Using Our Service</h2>
          <p>
            You must follow any policies made available to you within the Service.
            You may use our Service only as permitted by law, including when creating or participating in casual plans, attending events, or interacting with other users.
            We may suspend or stop providing our Service to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your the lineup Account</h2>
          <p>
            You may need an account to use some of our Services, including creating casual plans, RSVPing to events, and connecting with friends.
            You are responsible for safeguarding your account, and for any activity that occurs through your account.
            You must provide accurate information and keep your profile information up to date.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Content and Casual Plans</h2>
          <p>
            When you upload, submit, store, send or receive content to or through our Service, including casual plans, event information, or profile content,
            you give us a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform,
            publicly display and distribute such content for the purpose of providing the Service.
          </p>
          <p>
            You are responsible for the content you post, including casual plans you create. You warrant that you have the right to share this content
            and that it does not violate any laws or third-party rights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Casual Plans Specific Terms</h2>
          <p>When creating or participating in casual plans:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate information about the plan, including location, time, and activity details</li>
            <li>You are responsible for the safety and legality of plans you create</li>
            <li>We are not liable for any issues that arise during casual plans meetups</li>
            <li>Users participate in casual plans at their own risk</li>
            <li>We reserve the right to remove any casual plan that violates our policies</li>
            <li>You should meet in public places and follow general safety guidelines</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Safety and Interactions</h2>
          <p>
            When meeting other users through events or casual plans, please prioritize your safety:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Meet in public places for initial meetups</li>
            <li>Inform someone you trust about your plans</li>
            <li>Trust your instincts and leave if you feel uncomfortable</li>
            <li>Report any inappropriate behavior through our platform</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violating any laws or regulations</li>
            <li>Infringing the intellectual property rights of others</li>
            <li>Submitting false or misleading information</li>
            <li>Creating fake casual plans or events</li>
            <li>Harassment, threats, or intimidation of other users</li>
            <li>Uploading or transmitting viruses or malicious code</li>
            <li>Attempting to access, tamper with, or use non-public areas of the platform</li>
            <li>Using the service for commercial purposes without permission</li>
            <li>Impersonating others or creating fake profiles</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Liability and Disclaimers</h2>
          <p>
            The lineup is a platform that connects people for events and casual activities. We do not organize, supervise, or take responsibility
            for any events or casual plans created by users. Users participate at their own risk and are responsible for their own safety.
            We provide the platform "as is" without warranties of any kind.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Changes to These Terms</h2>
          <p>
            We may modify these terms or any additional terms that apply to a Service from time to time.
            We will provide reasonable advance notice of material modifications and obtain your consent where required by law.
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
