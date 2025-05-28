import { Link } from "react-router-dom";
import { bohemianColors } from "@/polymet/components/bohemian-color-palette";

type BohemianLogoProps = {
  style?: "minimal" | "circle" | "waves" | "script";
  variant?: "default" | "light" | "dark" | "terracotta" | "teal";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  showText?: boolean;
  href?: string;
  className?: string;
};

export default function BohemianLogo({
  style = "minimal",
  variant = "default",
  size = "md",
  showIcon = true,
  showText = true,
  href = "/",
  className = "",
}: BohemianLogoProps) {
  // Size mappings
  const sizeClasses = {
    xs: "h-6",
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-16",
  };

  // Text size mappings
  const textSizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  // Color mappings
  const colorClasses = {
    default: "text-primary",
    light: "text-white",
    dark: "text-[#2A2A2A]",
    terracotta: "text-[#C06D59]",
    teal: "text-[#3A7D7E]",
  };

  // Icon color mappings
  const iconColorClasses = {
    default: "#2A2A2A",
    light: "#FFFFFF",
    dark: "#2A2A2A",
    terracotta: "#C06D59",
    teal: "#3A7D7E",
  };

  // Render the logo content
  const renderLogoContent = () => (
    <div className={`flex items-center ${className}`}>
      {showIcon && (
        <div className={`${sizeClasses[size]} mr-2`}>
          {style === "minimal" && (
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto"
            >
              <path
                d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5ZM20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20C8 13.3726 13.3726 8 20 8Z"
                fill={iconColorClasses[variant]}
              />

              <path
                d="M20 14C17.7909 14 16 15.7909 16 18C16 19.1046 16.8954 20 18 20C19.1046 20 20 19.1046 20 18C20 17.4477 20.4477 17 21 17C21.5523 17 22 17.4477 22 18C22 20.2091 20.2091 22 18 22C15.7909 22 14 20.2091 14 18C14 14.6863 16.6863 12 20 12C23.3137 12 26 14.6863 26 18C26 21.3137 23.3137 24 20 24C16.6863 24 14 21.3137 14 18"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}

          {style === "circle" && (
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto"
            >
              <circle
                cx="20"
                cy="20"
                r="15"
                fill={iconColorClasses[variant]}
                fillOpacity="0.1"
              />

              <path
                d="M20 12C16.6863 12 14 14.6863 14 18C14 21.3137 16.6863 24 20 24C23.3137 24 26 21.3137 26 18C26 14.6863 23.3137 12 20 12ZM20 14C22.2091 14 24 15.7909 24 18C24 20.2091 22.2091 22 20 22C17.7909 22 16 20.2091 16 18C16 15.7909 17.7909 14 20 14Z"
                fill={iconColorClasses[variant]}
              />

              <path
                d="M18 18C18 19.1046 17.1046 20 16 20C14.8954 20 14 19.1046 14 18"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M26 18C26 19.1046 25.1046 20 24 20C22.8954 20 22 19.1046 22 18"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}

          {style === "waves" && (
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto"
            >
              <path
                d="M8 20C8 20 12 16 20 16C28 16 32 20 32 20"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M10 24C10 24 14 20 20 20C26 20 30 24 30 24"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M12 28C12 28 15 24 20 24C25 24 28 28 28 28"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}

          {style === "script" && (
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto"
            >
              <path
                d="M10 25C10 25 15 15 20 15C25 15 25 25 30 25"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M10 20C10 20 15 10 20 10C25 10 25 20 30 20"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M10 30C10 30 15 20 20 20C25 20 25 30 30 30"
                stroke={iconColorClasses[variant]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      )}

      {showText && (
        <div
          className={`font-medium ${textSizeClasses[size]} ${colorClasses[variant]}`}
        >
          <span className="font-normal opacity-80">the</span>
          lineup
        </div>
      )}
    </div>
  );

  // Return as link or standalone element
  return href ? (
    <Link to={href} className="transition-opacity hover:opacity-90">
      {renderLogoContent()}
    </Link>
  ) : (
    renderLogoContent()
  );
}
