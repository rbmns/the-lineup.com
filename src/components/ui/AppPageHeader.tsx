
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

interface AppPageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

// A single main h1 header with the correct brand typography for page titles.
export const AppPageHeader: React.FC<AppPageHeaderProps> = ({ children, className = "" }) => (
  <h1 className={`${typography.h1} mb-2 ${className}`}>
    {children}
  </h1>
);

export default AppPageHeader;
