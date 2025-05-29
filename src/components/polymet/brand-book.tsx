import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { brandColors } from "@/polymet/components/brand-colors";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
  TypographySmall,
  TypographyMono,
  TypographyAccent,
  TypographyTagline,
} from "@/polymet/components/brand-typography";
import BrandLogo from "@/polymet/components/brand-logo";

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
        <TypographyTagline className="text-vibrant-teal">
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
            <div className="p-6 bg-nature-ocean text-white rounded-lg">
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
                  color: "bg-nature-ocean",
                },
                {
                  name: "Authentic Connection",
                  description:
                    "Fostering genuine relationships between people and places",
                  color: "bg-nature-coral",
                },
                {
                  name: "Adventure",
                  description:
                    "Embracing new experiences and stepping outside comfort zones",
                  color: "bg-nature-sand",
                },
                {
                  name: "Simplicity",
                  description:
                    "Focusing on what matters most and reducing complexity",
                  color: "bg-nature-seafoam",
                },
                {
                  name: "Local Culture",
                  description:
                    "Celebrating and preserving the uniqueness of coastal communities",
                  color: "bg-vibrant-teal",
                },
              ].map((value) => (
                <div
                  key={value.name}
                  className={cn(
                    "p-4 rounded-lg",
                    value.color,
                    value.name === "Adventure" ? "text-primary" : "text-white"
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
              <div className="p-12 border border-secondary-50 rounded-lg bg-white">
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
                <div className="p-8 border border-secondary-50 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo variant="default" />
                </div>
                <TypographySmall>Default</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-secondary-50 rounded-lg bg-primary w-full flex justify-center">
                  <BrandLogo variant="white" />
                </div>
                <TypographySmall>White (on dark)</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-secondary-50 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo showText={false} />
                </div>
                <TypographySmall>Icon Only</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-secondary-50 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo showIcon={false} />
                </div>
                <TypographySmall>Text Only</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-secondary-50 rounded-lg bg-white w-full flex justify-center">
                  <BrandLogo size="sm" />
                </div>
                <TypographySmall>Small</TypographySmall>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-8 border border-secondary-50 rounded-lg bg-white w-full flex justify-center">
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
                            ? "bg-nature-ocean text-white"
                            : "bg-secondary-25"
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
                        "bg-gradient-to-r from-nature-ocean to-nature-seafoam":
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
              <div className="p-12 border border-secondary-50 rounded-lg bg-white relative">
                <div className="absolute inset-0 border-2 border-dashed border-nature-ocean/30 m-12"></div>
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
                <div className="h-24 bg-nature-ocean rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Ocean Deep
                  </TypographySmall>
                  <TypographySmall className="text-primary-75">
                    #005F73
                  </TypographySmall>
                </div>
                <TypographySmall className="text-primary-75">
                  Primary brand color, used for key elements and accents
                </TypographySmall>
              </div>
              <div className="space-y-2">
                <div className="h-24 bg-nature-coral rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Sunset Orange
                  </TypographySmall>
                  <TypographySmall className="text-primary-75">
                    #EE6C4D
                  </TypographySmall>
                </div>
                <TypographySmall className="text-primary-75">
                  Used for calls-to-action and highlighting important elements
                </TypographySmall>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TypographyH3>Secondary Colors</TypographyH3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <div className="h-16 bg-nature-sand rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Sand Beige
                  </TypographySmall>
                  <TypographySmall className="text-primary-75">
                    #E9C46A
                  </TypographySmall>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-primary-75 rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">
                    Driftwood Gray
                  </TypographySmall>
                  <TypographySmall className="text-primary-75">
                    #8C8C89
                  </TypographySmall>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-white border border-secondary-50 rounded-lg"></div>
                <div>
                  <TypographySmall className="font-bold">White</TypographySmall>
                  <TypographySmall className="text-primary-75">
                    #FFFFFF
                  </TypographySmall>
                </div>
              </div>
            </div>
            <TypographySmall className="text-primary-75">
              Secondary colors provide balance and complement the primary
              palette. Use them for backgrounds, supporting elements, and to
              create visual hierarchy.
            </TypographySmall>
          </div>
        </div>

        <div className="mt-8">
          <TypographyH3>Extended Palette</TypographyH3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            {Object.entries(brandColors.extended.oceanDeep)
              .sort(
                ([a], [b]) =>
                  parseInt(b.replace(/\D/g, "")) -
                  parseInt(a.replace(/\D/g, ""))
              )
              .map(([shade, color]) => (
                <div key={shade} className="space-y-2">
                  <div
                    className="h-12 rounded-lg"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="flex justify-between">
                    <TypographySmall>Ocean {shade}</TypographySmall>
                    <TypographySmall className="text-primary-75">
                      {color}
                    </TypographySmall>
                  </div>
                </div>
              ))}
          </div>
          <TypographySmall className="text-primary-75 mt-3">
            The extended palette provides additional shades of our primary Ocean
            Deep color for flexibility in design applications.
          </TypographySmall>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <TypographyH2>Typography</TypographyH2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <TypographyH3>Primary Font: Inter</TypographyH3>
            <div className="p-6 bg-white border border-secondary-50 rounded-lg space-y-4">
              <div>
                <TypographyH1>Heading 1</TypographyH1>
                <TypographySmall className="text-primary-75">
                  Inter / 48px / Bold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyH2>Heading 2</TypographyH2>
                <TypographySmall className="text-primary-75">
                  Inter / 30px / Semibold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyH3>Heading 3</TypographyH3>
                <TypographySmall className="text-primary-75">
                  Inter / 24px / Semibold / Tracking tight
                </TypographySmall>
              </div>
              <div>
                <TypographyH4>Heading 4</TypographyH4>
                <TypographySmall className="text-primary-75">
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
                <TypographySmall className="text-primary-75">
                  Inter / 16px / Regular / Leading relaxed
                </TypographySmall>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TypographyH3>Secondary Font: JetBrains Mono</TypographyH3>
            <div className="p-6 bg-white border border-secondary-50 rounded-lg space-y-4">
              <div>
                <TypographyTagline>Tagline Text</TypographyTagline>
                <TypographySmall className="text-primary-75">
                  JetBrains Mono / 18px / Medium / Tracking wide
                </TypographySmall>
              </div>
              <div>
                <TypographyAccent>ACCENT TEXT</TypographyAccent>
                <TypographySmall className="text-primary-75">
                  JetBrains Mono / 14px / Uppercase / Tracking wider
                </TypographySmall>
              </div>
              <div>
                <TypographyMono>Monospace Text</TypographyMono>
                <TypographySmall className="text-primary-75">
                  JetBrains Mono / 14px / Regular
                </TypographySmall>
              </div>
              <div className="pt-4">
                <TypographySmall className="text-primary-75">
                  JetBrains Mono is used sparingly for accents, labels, and
                  special text elements to create visual interest and hierarchy.
                </TypographySmall>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imagery Style */}
      <section className="space-y-6">
        <TypographyH2>Imagery Style</TypographyH2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <TypographyH3>Photography Guidelines</TypographyH3>
            <TypographyP>
              Our imagery style focuses on authentic, candid coastal lifestyle
              photos with natural lighting and warm tones. Images should evoke a
              sense of freedom, connection, and the joy of coastal living.
            </TypographyP>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <img
                  src="https://picsum.photos/seed/beach123/400/300"
                  alt="Beach lifestyle"
                  className="rounded-lg object-cover aspect-4/3 w-full"
                />

                <TypographySmall className="text-primary-75">
                  Natural lighting with warm tones
                </TypographySmall>
              </div>
              <div className="space-y-2">
                <img
                  src="https://picsum.photos/seed/yoga456/400/300"
                  alt="Yoga session"
                  className="rounded-lg object-cover aspect-4/3 w-full"
                />

                <TypographySmall className="text-primary-75">
                  Authentic activities, not staged
                </TypographySmall>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TypographyH3>Image Treatment</TypographyH3>
            <TypographyP>
              Apply subtle treatments to maintain consistency across all
              imagery. This helps create a cohesive visual identity while
              allowing the natural beauty of coastal scenes to shine.
            </TypographyP>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src="https://picsum.photos/seed/surf789/400/300"
                    alt="Surfing"
                    className="rounded-lg object-cover aspect-4/3 w-full"
                  />

                  <div className="absolute inset-0 bg-nature-ocean/20 mix-blend-overlay rounded-lg"></div>
                </div>
                <TypographySmall className="text-primary-75">
                  Subtle brand color overlay
                </TypographySmall>
              </div>
              <div className="space-y-2">
                <img
                  src="https://picsum.photos/seed/market123/400/300"
                  alt="Beach market"
                  className="rounded-lg object-cover aspect-4/3 w-full brightness-105 saturate-110 sepia-[0.15]"
                />

                <TypographySmall className="text-primary-75">
                  Warm filter enhancement
                </TypographySmall>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Messaging */}
      <section className="space-y-6">
        <TypographyH2>Messaging Framework</TypographyH2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <TypographyH3>Tone of Voice</TypographyH3>
            <div className="p-6 bg-white border border-secondary-50 rounded-lg space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Warm</h4>
                <TypographyP>
                  We speak with genuine friendliness and approachability,
                  creating a welcoming atmosphere for all users.
                </TypographyP>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Clear</h4>
                <TypographyP>
                  We communicate directly and simply, avoiding jargon and making
                  information easily accessible.
                </TypographyP>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Genuine</h4>
                <TypographyP>
                  We speak honestly and authentically, building trust through
                  transparency and reliability.
                </TypographyP>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Casual but Professional</h4>
                <TypographyP>
                  We strike a balance between friendly conversation and
                  trustworthy expertise.
                </TypographyP>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TypographyH3>Messaging Pillars</TypographyH3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-nature-ocean text-white rounded-lg">
                <h4 className="font-bold mb-2">Discover</h4>
                <p className="text-sm">
                  Explore unique events and experiences in coastal communities
                </p>
              </div>
              <div className="p-4 bg-nature-coral text-white rounded-lg">
                <h4 className="font-bold mb-2">Connect</h4>
                <p className="text-sm">
                  Build meaningful relationships with like-minded people
                </p>
              </div>
              <div className="p-4 bg-nature-seafoam text-white rounded-lg">
                <h4 className="font-bold mb-2">Flow</h4>
                <p className="text-sm">
                  Embrace the natural rhythm of coastal living
                </p>
              </div>
              <div className="p-4 bg-nature-sand text-primary rounded-lg">
                <h4 className="font-bold mb-2">Support Local</h4>
                <p className="text-sm">
                  Contribute to thriving coastal communities
                </p>
              </div>
            </div>
            <div className="mt-4 p-5 bg-secondary-25 rounded-lg">
              <h4 className="font-medium mb-3">Example Messaging</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border border-secondary-50">
                  <TypographyTagline className="text-nature-ocean text-sm">
                    DISCOVER
                  </TypographyTagline>
                  <TypographyP className="mt-1">
                    Find your perfect wave with local surf events happening this
                    weekend.
                  </TypographyP>
                </div>
                <div className="p-3 bg-white rounded border border-secondary-50">
                  <TypographyTagline className="text-nature-coral text-sm">
                    CONNECT
                  </TypographyTagline>
                  <TypographyP className="mt-1">
                    Join fellow yoga enthusiasts for sunrise sessions on the
                    beach.
                  </TypographyP>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-secondary-50 text-center">
        <TypographySmall className="text-primary-75">
          © {new Date().getFullYear()} the lineup. All rights reserved.
        </TypographySmall>
        <div className="mt-2 flex justify-center">
          <TypographyTagline className="text-nature-ocean text-sm">
            Join the Flow.
          </TypographyTagline>
        </div>
      </footer>
    </div>
  );
}
