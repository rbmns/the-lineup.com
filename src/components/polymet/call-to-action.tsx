
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "subtle";
}

export default function CallToAction({
  title,
  description,
  buttonText,
  buttonHref,
  onClick,
  className,
  variant = "default",
}: CallToActionProps) {
  const variantStyles = {
    default: "bg-secondary",
    subtle: "bg-white border border-secondary-50",
  };

  return (
    <section
      className={cn(
        "py-12 px-4 text-center",
        variantStyles[variant],
        className
      )}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mb-8 text-primary-75">{description}</p>

        {buttonHref ? (
          <Button
            variant={variant === "default" ? "default" : "secondary"}
            size="lg"
            asChild
          >
            <a href={buttonHref}>{buttonText}</a>
          </Button>
        ) : (
          <Button
            variant={variant === "default" ? "default" : "secondary"}
            size="lg"
            onClick={onClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </section>
  );
}
