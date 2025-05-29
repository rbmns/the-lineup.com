import React from 'react';
import { Link } from "react-router-dom";
import { Logo } from '@/components/polymet/logo';
import { Separator } from '@/components/ui/separator';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  GlobeIcon,
  MapPinIcon,
  MailIcon,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-primary-950 border-t border-secondary-50 dark:border-primary-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-neutral-75 dark:text-neutral-25 max-w-xs">
              Discover local events and connect with like-minded people in your
              community.
            </p>
            <p className="mt-4 text-sm font-jetbrains-mono text-vibrant-sunset dark:text-vibrant-sunset">
              Join the Flow
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
              >
                <FacebookIcon size={20} />

                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
              >
                <InstagramIcon size={20} />

                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
              >
                <TwitterIcon size={20} />

                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="text-sm font-semibold text-primary dark:text-white">
              Discover
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/events"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/plans"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Casual Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/friends"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Friends
                </Link>
              </li>
              <li>
                <Link
                  to="/friends/events"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Friends' Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary dark:text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-75 hover:text-primary dark:text-neutral-25 dark:hover:text-white transition-colors"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-50 dark:border-primary-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-neutral-75 dark:text-neutral-25">
            &copy; {new Date().getFullYear()} thelineup. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center text-xs text-neutral-75 dark:text-neutral-25">
              <MapPinIcon size={14} className="mr-1" />

              <span>Zandvoort, Netherlands</span>
            </div>
            <div className="flex items-center text-xs text-neutral-75 dark:text-neutral-25">
              <MailIcon size={14} className="mr-1" />

              <a
                href="mailto:hello@thelineup.com"
                className="hover:text-primary dark:hover:text-white transition-colors"
              >
                hello@thelineup.com
              </a>
            </div>
            <div className="flex items-center text-xs text-neutral-75 dark:text-neutral-25">
              <GlobeIcon size={14} className="mr-1" />

              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
