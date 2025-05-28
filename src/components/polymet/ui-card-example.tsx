import { cn } from "@/lib/utils";
import { badgeVariants } from "@/polymet/components/brand-colors";
import BrandLogo from "@/polymet/components/brand-logo";
import { UserIcon, UsersIcon, MapPinIcon, CalendarIcon } from "lucide-react";

interface UICardExampleProps {
  title: string;
  category: string;
  date: string;
  location: string;
  attendees: number;
  image: string;
  variant?: "default" | "featured";
  className?: string;
}

export default function UICardExample({
  title,
  category,
  date,
  location,
  attendees,
  image,
  variant = "default",
  className,
}: UICardExampleProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-secondary-100 bg-white shadow-sm transition-all hover:shadow-md",
        variant === "featured" ? "flex flex-col md:flex-row" : "flex flex-col",
        className
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative",
          variant === "featured"
            ? "h-48 w-full md:h-auto md:w-2/5"
            : "h-48 w-full"
        )}
      >
        <img src={image} alt={title} className="h-full w-full object-cover" />

        <div className="absolute left-3 top-3">
          <span
            className={badgeVariants({
              variant: "default",
              className: "bg-primary-oceanDeep",
            })}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-1 flex-col p-4",
          variant === "featured" && "md:p-6"
        )}
      >
        <h3
          className={cn(
            "mb-2 font-inter font-semibold tracking-tight",
            variant === "featured" ? "text-xl md:text-2xl" : "text-lg"
          )}
        >
          {title}
        </h3>

        <div className="mb-4 space-y-2 text-sm text-secondary-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />

            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />

            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />

            <span>{attendees} attending</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <BrandLogo size="sm" showText={false} />

            <span className="text-xs text-secondary-500">the lineup</span>
          </div>

          <button className="rounded-full bg-primary-oceanDeep p-2 text-white hover:bg-extended-oceanDeep-600">
            <UserIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
