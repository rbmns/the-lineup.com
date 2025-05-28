import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/polymet/components/button";

interface HeroSectionProps {
  title: string;
  location?: string;
  subtitle: string;
  onExplore?: () => void;
  onCreateProfile?: () => void;
  children?: ReactNode;
}

export default function HeroSection({
  title,
  location,
  subtitle,
  onExplore,
  onCreateProfile,
  children,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-16 text-white md:py-24">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/beach123/1920/1080"
          alt="Background"
          className="h-full w-full object-cover brightness-75"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-inter">
              {title}{" "}
              {location && (
                <span className="text-vibrant-sunset">{location}</span>
              )}
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-lg text-white/90 md:mx-0 font-inter">
              {subtitle}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
              <Button
                variant="secondary"
                size="lg"
                className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
                onClick={onExplore}
                asChild
              >
                <Link to="/events">Explore Events</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-white text-white hover:bg-white/10 sm:w-auto"
                onClick={onCreateProfile}
                asChild
              >
                <Link to="/auth?tab=signup">Create Profile</Link>
              </Button>
            </div>
          </div>

          {/* Right side content slot */}
          <div className="hidden md:block">{children}</div>
        </div>
      </div>
    </section>
  );
}
