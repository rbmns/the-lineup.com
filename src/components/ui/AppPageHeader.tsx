
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

interface AppPageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

// Main h1 header, no added top margin.
export const AppPageHeader: React.FC<AppPageHeaderProps> = ({ children, className = "" }) => (
  <h1 className={`${typography.h1} mb-2 mt-0 ${className}`}>
    {children}
  </h1>
);

export default AppPageHeader;
