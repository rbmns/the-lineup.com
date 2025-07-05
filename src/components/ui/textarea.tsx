
import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-mist-grey bg-pure-white px-3 py-2 text-sm text-graphite-grey shadow-sm placeholder:text-graphite-grey/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-horizon-blue focus-visible:border-horizon-blue hover:border-ocean-teal disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
