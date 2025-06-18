
import React from "react";
import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  children = "Continue with Google",
  className = "",
}) => (
  <Button
    type="button"
    variant="outline"
    size="lg"
    className={`w-full ${className}`}
    onClick={onClick}
    disabled={loading || disabled}
  >
    <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2" aria-hidden="true">
      <g>
        <path
          d="M44.5 20H24v8.5h11.7C34.6 33.1 29.8 36 24 36c-6.7 0-12.3-5.4-12.3-12S17.3 12 24 12c3.1 0 5.9 1.1 8 3l6-6C34.2 4.5 29.4 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5c10.6 0 20-7.7 20-20 0-1.3-.1-2.2-.3-3.5z"
          fill="#fbbc04"
        />
        <path
          d="M6.3 14.7l7 5.1C15.2 16.3 19.3 12.5 24 12.5c3.1 0 5.8 1.1 8 3l6-6C34.2 4.5 29.4 2.5 24 2.5 16.3 2.5 9.5 7.5 6.3 14.7z"
          fill="#ea4335"
        />
        <path
          d="M24 43.5c5.7 0 10.6-1.8 14.7-5.1L32 32.1c-2.1 1.6-5.1 2.6-8 2.6-5.8 0-10.6-3.9-12.2-9.2l-7 5.4C9.5 38.7 16.3 43.5 24 43.5z"
          fill="#34a853"
        />
        <path
          d="M44.5 20H24v8.5h11.7c-1.1 3.3-3.8 5.6-7.7 5.6-2.3 0-4.4-.7-6-2l-7.1 5.5C18.2 41.4 21 43.5 24 43.5c5.6 0 10.5-1.8 14.6-5.2l-7-5.3c-2.2 1.5-4.7 2.5-7.6 2.5-6.1 0-11-5.1-11-11.4s4.9-11.4 11-11.4c2.5 0 5 .7 7.1 2L36 16l-7.1 5.5z"
          fill="#4285f4"
        />
      </g>
    </svg>
    {loading ? "Loading..." : children}
  </Button>
);

export default GoogleAuthButton;
