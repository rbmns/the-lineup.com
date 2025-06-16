
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { typography } from "@/components/polymet/brand-typography";

const HomeCtaSection = () => (
  <section className="py-16 w-full gradient-ocean bg-cyan-500">
    <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className={`${typography.h2} text-white mb-4`}>
          Ready to Find Your Next <span className="font-handwritten text-sunset-yellow">Adventure?</span>
        </h2>
        <p className={`${typography.lead} text-white/90 mb-8`}>
          Join our community and start discovering events that match your interests and vibe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="btn-sunset text-white font-medium">
            <Link to="/events">
              <Search className="mr-2 h-4 w-4" />
              Explore Events
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
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
