import { cn } from "@/lib/utils";
import { UserIcon, UsersIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/polymet/components/button";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Step({ icon, title, description }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nature-ocean/10 text-nature-ocean">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-primary-75">{description}</p>
    </div>
  );
}

interface HowItWorksSectionProps {
  className?: string;
  onBrowse?: () => void;
}

export default function HowItWorksSection({
  className,
  onBrowse,
}: HowItWorksSectionProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-primary-75">
            Create a profile to connect with friends and get personalized
            recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <Step
            icon={<UserIcon size={32} strokeWidth={1.5} />}
            title="Create Your Profile"
            description="Tell us a bit about yourself and your vibe."
          />

          <Step
            icon={<UsersIcon size={32} strokeWidth={1.5} />}
            title="Connect with Friends"
            description="Find your crew and see what they're up to."
          />

          <Step
            icon={<CalendarIcon size={32} strokeWidth={1.5} />}
            title="Discover Events"
            description="Join local events your friends love."
          />
        </div>

        {onBrowse && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              onClick={onBrowse}
              className="border-primary-50 text-primary hover:bg-primary-10"
            >
              Or... Just Browse Events
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
