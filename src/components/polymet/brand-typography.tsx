import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "font-inter text-4xl font-bold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-inter text-3xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "font-inter text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        "font-inter text-xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyP({ children, className }: TypographyProps) {
  return (
    <p className={cn("font-inter text-base leading-7", className)}>
      {children}
    </p>
  );
}

export function TypographySmall({ children, className }: TypographyProps) {
  return (
    <small
      className={cn("font-inter text-sm font-medium leading-none", className)}
    >
      {children}
    </small>
  );
}

export function TypographyLead({ children, className }: TypographyProps) {
  return (
    <p className={cn("font-inter text-xl text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function TypographyLarge({ children, className }: TypographyProps) {
  return (
    <div className={cn("font-inter text-lg font-semibold", className)}>
      {children}
    </div>
  );
}

export function TypographyMuted({ children, className }: TypographyProps) {
  return (
    <p className={cn("font-inter text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function TypographyMono({ children, className }: TypographyProps) {
  return (
    <code
      className={cn(
        "font-jetbrains-mono relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
    >
      {children}
    </code>
  );
}

export function TypographyAccent({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        "font-jetbrains-mono text-sm uppercase tracking-wider",
        className
      )}
    >
      {children}
    </span>
  );
}

export function TypographyTagline({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-jetbrains-mono text-lg font-medium tracking-wide",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyButton({ children, className }: TypographyProps) {
  return (
    <span className={cn("font-jetbrains-mono text-sm font-medium", className)}>
      {children}
    </span>
  );
}

export function TypographyLabel({ children, className }: TypographyProps) {
  return (
    <label
      className={cn(
        "font-jetbrains-mono text-xs uppercase tracking-wider",
        className
      )}
    >
      {children}
    </label>
  );
}

export default {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  P: TypographyP,
  Small: TypographySmall,
  Lead: TypographyLead,
  Large: TypographyLarge,
  Muted: TypographyMuted,
  Mono: TypographyMono,
  Accent: TypographyAccent,
  Tagline: TypographyTagline,
  Button: TypographyButton,
  Label: TypographyLabel,
};
