
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { typography } from "@/components/polymet/brand-typography";

const HomeCtaSection = () => (
  <section className="py-16 w-full bg-white">
    <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className={`${typography.h2} text-gray-900 mb-4`}>
          Ready to Find Your Next <span className="text-gray-700">Adventure?</span>
        </h2>
        <p className={`${typography.lead} text-gray-700 mb-8`}>
          Join our community and start discovering events that match your interests and vibe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white font-medium">
            <Link to="/events">
              <Search className="mr-2 h-4 w-4" />
              Explore Events
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          >
            <Link to="/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Create Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default HomeCtaSection;
