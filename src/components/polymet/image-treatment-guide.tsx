import { useState } from "react";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/polymet/components/brand-colors";
import { Button } from "@/polymet/components/button";

interface ImageTreatmentGuideProps {
  image?: string;
  className?: string;
}

type TreatmentType =
  | "original"
  | "brand-overlay"
  | "warm"
  | "cool"
  | "high-contrast"
  | "muted";

interface TreatmentOption {
  id: TreatmentType;
  name: string;
  description: string;
  style: React.CSSProperties;
  className?: string;
  recommended?: boolean;
  useCases: string[];
}

export default function ImageTreatmentGuide({
  image = "https://picsum.photos/seed/beach123/1200/800",
  className,
}: ImageTreatmentGuideProps) {
  const [activeTreatment, setActiveTreatment] =
    useState<TreatmentType>("brand-overlay");
  const [currentImage, setCurrentImage] = useState(image);

  const sampleImages = [
    {
      id: "beach",
      url: "https://picsum.photos/seed/beach123/1200/800",
      label: "Beach Scene",
    },
    {
      id: "yoga",
      url: "https://picsum.photos/seed/yoga456/1200/800",
      label: "Yoga Class",
    },
    {
      id: "surf",
      url: "https://picsum.photos/seed/surf789/1200/800",
      label: "Surfing",
    },
    {
      id: "music",
      url: "https://picsum.photos/seed/music234/1200/800",
      label: "Music Event",
    },
  ];

  const treatments: TreatmentOption[] = [
    {
      id: "original",
      name: "Original",
      description: "Unmodified image with no filters or overlays",
      style: {},
      useCases: [
        "Product photography",
        "Documentation",
        "When authenticity is key",
      ],
    },
    {
      id: "brand-overlay",
      name: "Brand Overlay",
      description: "Image with a subtle Ocean Deep color overlay",
      style: {
        filter: "brightness(0.95)",
      },
      className:
        "after:absolute after:inset-0 after:bg-primary after:opacity-20 after:mix-blend-overlay",
      recommended: true,
      useCases: ["Hero images", "Featured content", "Event promotions"],
    },
    {
      id: "warm",
      name: "Warm Filter",
      description: "Adds a warm, Sunset Orange tone to images",
      style: {
        filter: "brightness(1.05) saturate(1.1) sepia(0.2)",
      },
      useCases: ["Sunset events", "Social gatherings", "Food-related content"],
    },
    {
      id: "cool",
      name: "Cool Filter",
      description: "Adds a cool, Ocean Deep tone to images",
      style: {
        filter: "brightness(1) saturate(1.1) hue-rotate(-10deg)",
      },
      useCases: [
        "Water activities",
        "Surf events",
        "Outdoor daytime activities",
      ],
    },
    {
      id: "high-contrast",
      name: "High Contrast",
      description: "Increases contrast for more vibrant images",
      style: {
        filter: "contrast(1.2) brightness(1.05)",
      },
      useCases: ["Music events", "Festivals", "Nighttime activities"],
    },
    {
      id: "muted",
      name: "Muted",
      description: "Reduces saturation for a more subtle Sand Beige look",
      style: {
        filter: "saturate(0.8) brightness(1.05)",
      },
      useCases: ["Background images", "Secondary content", "Text overlays"],
    },
  ];

  const activeTreatmentData = treatments.find((t) => t.id === activeTreatment);

  const handleImageChange = (url: string) => {
    setCurrentImage(url);
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex flex-wrap gap-3 mb-8">
        {sampleImages.map((img) => (
          <Button
            key={img.id}
            onClick={() => handleImageChange(img.url)}
            variant={currentImage === img.url ? "default" : "outline"}
            size="sm"
          >
            {img.label}
          </Button>
        ))}
      </div>

      {/* Image Preview */}
      <div className="overflow-hidden rounded-lg border border-secondary-50 bg-white shadow-sm">
        <div className="relative aspect-[16/9] w-full">
          <div
            className={cn(
              "relative h-full w-full",
              activeTreatmentData?.className
            )}
          >
            <img
              src={currentImage}
              alt={`Image with ${activeTreatment} treatment`}
              className="h-full w-full object-cover"
              style={activeTreatmentData?.style}
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-primary">
              {activeTreatmentData?.name}
            </h3>
            {activeTreatmentData?.recommended && (
              <span
                className={badgeVariants({
                  variant: "default",
                })}
              >
                Recommended
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-neutral-75">
            {activeTreatmentData?.description}
          </p>
        </div>
      </div>

      {/* Treatment Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Image Treatments</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {treatments.map((treatment) => (
            <button
              key={treatment.id}
              onClick={() => setActiveTreatment(treatment.id)}
              className={cn(
                "overflow-hidden rounded-md border transition-all hover:shadow-md",
                activeTreatment === treatment.id
                  ? "border-primary ring-2 ring-primary ring-opacity-20"
                  : "border-secondary-50"
              )}
            >
              <div
                className={cn(
                  "relative aspect-square w-full",
                  treatment.className
                )}
              >
                <img
                  src={currentImage}
                  alt={treatment.name}
                  className="h-full w-full object-cover"
                  style={treatment.style}
                />
              </div>
              <div className="p-2 text-center">
                <span
                  className={cn(
                    "text-xs font-medium",
                    activeTreatment === treatment.id
                      ? "text-primary"
                      : "text-neutral-75"
                  )}
                >
                  {treatment.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="rounded-lg bg-secondary p-4">
        <h3 className="font-medium text-primary">Usage Guidelines</h3>
        <ul className="mt-2 space-y-2 text-sm text-neutral-75">
          {activeTreatmentData?.useCases.map((useCase, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vibrant-sunset"></span>
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-secondary-50">
          <h4 className="text-sm font-medium text-primary mb-2">
            General Treatment Recommendations
          </h4>
          <ul className="space-y-1 text-sm text-neutral-75">
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vibrant-sunset mt-1.5"></span>
              <span>
                Use <strong>Brand Overlay</strong> for hero images and featured
                content
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vibrant-sunset mt-1.5"></span>
              <span>
                Use <strong>Warm Filter</strong> for sunset, social, and food
                events
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vibrant-sunset mt-1.5"></span>
              <span>
                Use <strong>Cool Filter</strong> for water, surf, and outdoor
                activities
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vibrant-sunset mt-1.5"></span>
              <span>
                Use <strong>High Contrast</strong> for music events and
                festivals
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-vibrant-sunset mt-1.5"></span>
              <span>
                Use <strong>Muted</strong> for background images and secondary
                content
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
