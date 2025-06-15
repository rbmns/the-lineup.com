
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { typography } from '@/components/polymet/brand-typography';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/polymet/logo';
import MarketingColorPalette from './marketing-color-palette';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/polymet/ui/tabs';

// Typography components
const TypographyH1 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h1 className={cn(typography.h1, className)}>{children}</h1>
);

const TypographyH2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn(typography.h2, className)}>{children}</h2>
);

const TypographyH3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn(typography.h3, className)}>{children}</h3>
);

const TypographyH4 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h4 className={cn(typography.h4, className)}>{children}</h4>
);

const TypographyP = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn(typography.body, className)}>{children}</p>
);

const TypographyLead = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn(typography.lead, className)}>{children}</p>
);

const TypographySmall = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <small className={cn(typography.small, className)}>{children}</small>
);

const TypographyTagline = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("text-lg font-medium uppercase tracking-wider", className)}>{children}</span>
);

const TypographyAccent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("text-sm font-medium uppercase tracking-wider", className)}>{children}</span>
);

const TypographyMono = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("font-mono text-sm", className)}>{children}</span>
);

// Brand Logo component
const BrandLogo = ({ variant = "default", size = "md", showText = true, showIcon = true }: {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showIcon?: boolean;
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg", 
    lg: "text-xl",
    xl: "text-2xl"
  };
  
  const textColor = variant === "white" ? "text-white" : "text-black";
  
  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <div className={cn("w-8 h-8 bg-primary rounded-full", variant === "white" && "bg-white")}>
        </div>
      )}
      {showText && (
        <span className={cn("font-medium lowercase", sizeClasses[size], textColor)}>
          thelineup
        </span>
      )}
    </div>
  );
};

interface BrandBookProps {
  className?: string;
}

export default function BrandBook({ className }: BrandBookProps) {
  const [logoBackground, setLogoBackground] = useState<
    "white" | "dark" | "image" | "color"
  >("white");

  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-6xl mx-auto space-y-12",
        className
      )}
    >
      {/* Brand Book Header */}
      <div className="space-y-2 text-center">
        <TypographyTagline className="text-primary">
          Brand Guidelines
        </TypographyTagline>
        <TypographyH1>the lineup</TypographyH1>
        <TypographyLead>
          A curated platform connecting nomads, locals, and travelers with surf,
          yoga, music, and lifestyle events along coastal communities.
        </TypographyLead>
      </div>

      {/* Brand Essence */}
      <section className="space-y-6">
        <TypographyH2>Brand Essence</TypographyH2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <TypographyH3>Tagline</TypographyH3>
            <div className="p-6 bg-primary text-white rounded-lg">
              <TypographyTagline className="text-2xl">
                Join the Flow.
              </TypographyTagline>
            </div>
            <TypographyP>
              Our tagline encapsulates the essence of our platform: an
              invitation to become part of a natural rhythm of connection,
              discovery, and coastal lifestyle.
            </TypographyP>
          </div>

          <div className="space-y-4">
            <TypographyH3>Core Values</TypographyH3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "Freedom",
                  description:
                    "The ability to explore and experience without constraints",
                  color: "bg-primary",
                },
                {
                  name: "Authentic Connection",
                  description:
                    "Fostering genuine relationships between people and places",
                  color: "bg-secondary",
                },
                {
                  name: "Adventure",
                  description:
                    "Embracing new experiences and stepping outside comfort zones",
                  color: "bg-accent-teal",
                },
                {
                  name: "Simplicity",
                  description:
                    "Focusing on what matters most and reducing complexity",
                  color: "bg-accent-coral",
                },
                {
                  name: "Local Culture",
                  description:
                    "Celebrating and preserving the uniqueness of coastal communities",
                  color: "bg-accent-lime",
                },
              ].map((value) => (
                <div
                  key={value.name}
                  className={cn(
                    "p-4 rounded-lg text-white",
                    value.color
                  )}
                >
                  <h4 className="font-bold mb-1">{value.name}</h4>
                  <p className="text-sm opacity-90">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="space-y-6">
        <TypographyH2>Logo</TypographyH2>
        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="primary">Primary Logo</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="space-y-6">
            <div className="flex flex-col items-center space-y-8">
              <div className="p-12 border border-gray-200 rounded-lg bg-white">
                <BrandLogo size="xl" />
              </div>
              <TypographyP className="text-center max-w-lg">
                Our primary logo combines a minimalist wave symbol with clean,
                lowercase typography. The three stylized waves arranged in a
                circle represent flow, connection, and coastal lifestyle.
              </TypographyP>
            </div>
          </TabsContent>

          <TabsContent value="variations" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-gray-200 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo variant="default" />
                </div>
                <TypographySmall>Default</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-gray-200 rounded-lg bg-primary w-full flex justify-center">
                  <BrandLogo variant="white" />
                </div>
                <TypographySmall>White (on dark)</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-gray-200 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo showText={false} />
                </div>
                <TypographySmall>Icon Only</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-gray-200 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo showIcon={false} />
                </div>
                <TypographySmall>Text Only</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-gray-200 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo size="sm" />
                </div>
                <TypographySmall>Small</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-gray-200 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo size="lg" />
                </div>
                <TypographySmall>Large</TypographySmall>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="space-y-6">
              <TypographyH4>Logo on Different Backgrounds</TypographyH4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    {["white", "dark", "image", "color"].map((bg) => (
                      <button
                        key={bg}
                        onClick={() =>
                          setLogoBackground(
                            bg as "white" | "dark" | "image" | "color"
                          )
                        }
                        className={cn(
                          "px-3 py-1 text-sm rounded-full",
                          logoBackground === bg
                            ? "bg-primary text-white"
                            : "bg-gray-200"
                        )}
                      >
                        {bg.charAt(0).toUpperCase() + bg.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div
                    className={cn(
                      "h-64 rounded-lg flex items-center justify-center p-8",
                      {
                        "bg-white": logoBackground === "white",
                        "bg-primary": logoBackground === "dark",
                        "bg-gradient-to-r from-primary to-secondary":
                          logoBackground === "color",
                      }
                    )}
                    style={
                      logoBackground === "image"
                        ? {
                            backgroundImage:
                              "url(https://picsum.photos/seed/beach123/800/600)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  >
                    <BrandLogo
                      variant={logoBackground === "white" ? "default" : "white"}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <TypographyH4>Do's and Don'ts</TypographyH4>
                  <div className="space-y-3">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Do</h5>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Maintain clear space around the logo</li>
                        <li>Use approved color variations</li>
                        <li>Scale proportionally</li>
                        <li>
                          Use the white version on dark or busy backgrounds
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Don't</h5>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Stretch or distort the logo</li>
                        <li>Change the logo colors</li>
                        <li>Add effects like shadows or outlines</li>
                        <li>Place on busy backgrounds without contrast</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <div className="flex flex-col items-center space-y-8">
              <div className="p-12 border border-gray-200 rounded-lg bg-white relative">
                <div className="absolute inset-0 border-2 border-dashed border-primary/30 m-12"></div>
                <BrandLogo size="lg" />
              </div>
              <TypographyP className="text-center max-w-lg">
                Always maintain a minimum clear space around the logo equal to
                the height of the wave icon. This ensures the logo remains
                visible and impactful in all applications.
              </TypographyP>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Color Palette */}
      <section className="space-y-6">
        <TypographyH2>Color Palette</TypographyH2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <TypographyH3>Primary Colors</TypographyH3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="h-24 bg-primary rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Ocean Deep
                  </TypographySmall>
                  <TypographySmall className="text-gray-600">
                    #0891b2
                  </TypographySmall>
                </div>
                <TypographySmall className="text-gray-600">
                  Primary brand color, used for key elements and accents
                </TypographySmall>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-secondary rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Sunset Orange
                  </TypographySmall>
                  <TypographySmall className="text-gray-600">
                    #f59e0b
                  </TypographySmall>
                </div>
                <TypographySmall className="text-gray-600">
                  Used for calls-to-action and highlighting important elements
                </TypographySmall>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TypographyH3>Secondary Colors</TypographyH3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <div className="h-16 bg-accent-teal rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Teal
                  </TypographySmall>
                  <TypographySmall className="text-gray-600">
                    #06b6d4
                  </TypographySmall>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-accent-coral rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Coral
                  </TypographySmall>
                  <TypographySmall className="text-gray-600">
                    #f43f5e
                  </TypographySmall>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-accent-lime rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Lime
                  </TypographySmall>
                  <TypographySmall className="text-gray-600">
                    #84cc16
                  </TypographySmall>
                </div>
              </div>
            </div>
            <TypographySmall className="text-gray-600">
              Secondary colors provide balance and complement the primary
              palette. Use them for backgrounds, supporting elements, and to
              create visual hierarchy.
            </TypographySmall>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <TypographyH2>Typography</TypographyH2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <TypographyH3>Primary Font: Inter</TypographyH3>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <div>
                <TypographyH1>Heading 1</TypographyH1>
                <TypographySmall className="text-gray-600">
                  Inter / 48px / Bold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyH2>Heading 2</TypographyH2>
                <TypographySmall className="text-gray-600">
                  Inter / 30px / Semibold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyH3>Heading 3</TypographyH3>
                <TypographySmall className="text-gray-600">
                  Inter / 24px / Semibold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyH4>Heading 4</TypographyH4>
                <TypographySmall className="text-gray-600">
                  Inter / 20px / Semibold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyP>
                  Body text is set in Inter Regular at 16px with comfortable
                  line height. The lineup is a platform for discovering and
                  planning surf, yoga, music, and lifestyle events in coastal
                  destinations.
                </TypographyP>
                <TypographySmall className="text-gray-600">
                  Inter / 16px / Regular / Leading relaxed
                </TypographySmall>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TypographyH3>Secondary Font: JetBrains Mono</TypographyH3>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <div>
                <TypographyTagline>Tagline Text</TypographyTagline>
                <TypographySmall className="text-gray-600">
                  JetBrains Mono / 18px / Medium / Tracking wide
                </TypographySmall>
              </div>
              <div>
                <TypographyAccent>ACCENT TEXT</TypographyAccent>
                <TypographySmall className="text-gray-600">
                  JetBrains Mono / 14px / Uppercase / Tracking wider
                </TypographySmall>
              </div>
              <div>
                <TypographyMono>Monospace Text</TypographyMono>
                <TypographySmall className="text-gray-600">
                  JetBrains Mono / 14px / Regular
                </TypographySmall>
              </div>
              <div className="pt-4">
                <TypographySmall className="text-gray-600">
                  JetBrains Mono is used sparingly for accents, labels, and
                  special text elements to create visual interest and hierarchy.
                </TypographySmall>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-gray-200 text-center">
        <TypographySmall className="text-gray-600">
          © {new Date().getFullYear()} the lineup. All rights reserved.
        </TypographySmall>
        <div className="mt-2 flex justify-center">
          <TypographyTagline className="text-primary text-sm">
            Join the Flow.
          </TypographyTagline>
        </div>
      </footer>
    </div>
  );
}
