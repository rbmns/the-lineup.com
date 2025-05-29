import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/polymet/components/button";
import { PlusIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
  variant?: "default" | "with-background" | "minimal";
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  actionHref,
  onActionClick,
  className,
  variant = "default",
  children,
}: PageHeaderProps) {
  // Determine if we should render the action button
  const showAction = actionLabel || actionIcon;

  // Determine if the action should be a link or a button
  const ActionComponent = actionHref ? (
    <Button variant="default" size="lg" asChild>
      <Link to={actionHref}>
        {actionIcon && <span className="mr-2">{actionIcon}</span>}
        {actionLabel}
      </Link>
    </Button>
  ) : (
    <Button variant="default" size="lg" onClick={onActionClick}>
      {actionIcon && <span className="mr-2">{actionIcon}</span>}
      {actionLabel}
    </Button>
  );

  // Styles based on variant
  const headerStyles = {
    default: "py-8",
    "with-background": "bg-nature-ocean text-white px-4 py-12 md:py-16",
    minimal: "py-6",
  };

  return (
    <header className={cn("w-full", headerStyles[variant], className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1
              className={cn(
                "text-3xl font-bold",
                variant === "with-background" ? "text-white" : "text-primary"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "mt-2",
                  variant === "with-background"
                    ? "text-white/80"
                    : "text-primary-75"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {showAction && <div className="flex-shrink-0">{ActionComponent}</div>}
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
