
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Signup = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-coastal-haze to-pure-white">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Welcome Header with improved styling */}
          <div className={cn(
            "text-center mb-8 relative",
            isMobile ? "mb-6" : "mb-8"
          )}>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-teal/5 to-seafoam-drift/10 rounded-3xl blur-xl"></div>
            
            <div className="relative z-10">
              <h1 className={cn(
                "font-montserrat font-bold text-graphite-grey mb-4 leading-tight",
                isMobile ? "text-2xl" : "text-3xl"
              )}>
                Join <span className="text-ocean-teal">The Lineup</span>
              </h1>
              <p className={cn(
                "text-horizon-blue/80 leading-relaxed font-lato mb-4",
                isMobile ? "text-sm" : "text-base"
              )}>
                Discover amazing events and connect with your community
              </p>
              <div className="flex justify-center items-center gap-4 text-xl opacity-70">
                <span className="animate-pulse">🎨</span>
                <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>🏖️</span>
                <span className="animate-pulse" style={{ animationDelay: '1s' }}>🎶</span>
              </div>
            </div>
          </div>

          {/* Enhanced Card */}
          <Card className="card-base relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Card Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-teal to-horizon-blue"></div>
            
            <CardHeader className={cn(
              "text-center relative",
              isMobile ? "pb-3 pt-6" : "pb-4 pt-8"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 to-transparent rounded-t-lg"></div>
              <div className="relative z-10">
                <CardTitle className={cn(
                  "text-ocean-teal mb-2 font-montserrat",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  Get Started
                </CardTitle>
                <CardDescription className={cn(
                  "text-graphite-grey/80 font-lato",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  Create your account to start discovering amazing events
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className={cn(
              "relative",
              isMobile ? "px-4 pb-6" : "px-6 pb-8"
            )}>
              <SignupForm onToggleMode={() => navigate('/login')} />
            </CardContent>
          </Card>
          
          {/* Bottom decorative elements */}
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center gap-2 text-xs text-graphite-grey/60 font-lato">
              <span>Trusted by event lovers worldwide</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-ocean-teal rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-horizon-blue rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-1 h-1 bg-dusk-coral rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
