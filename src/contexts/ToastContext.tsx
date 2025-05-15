
import React, { createContext, ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

// Simple context implementation that wraps the Toaster component
type ToastContextType = {
  children: ReactNode;
}

export const ToastContext = createContext<null>(null);

export const ToastProvider = ({ children }: ToastContextType) => {
  return (
    <ToastContext.Provider value={null}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};
