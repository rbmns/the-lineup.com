
import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  canNativeShare: boolean;
  userAgent: string;
  isIOS: boolean;
  isAndroid: boolean;
}

/**
 * Hook to detect device type and sharing capabilities with improved mobile detection
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    canNativeShare: false,
    userAgent: '',
    isIOS: false,
    isAndroid: false
  });
  
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      try {
        const userAgent = navigator.userAgent;
        
        // Enhanced mobile detection logic using multiple signals
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
                              (window.innerWidth <= 768) ||
                              ('ontouchstart' in window) ||
                              (window.matchMedia('(max-width: 768px)').matches);
        
        // More precise platform detection
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        const isAndroid = /Android/i.test(userAgent);
        
        // More comprehensive sharing capability detection
        const nativeShareAvailable = !!(
          navigator.share && 
          typeof navigator.share === 'function' && 
          // Check if running in a secure context (required for Web Share API)
          window.isSecureContext !== false
        );
        
        setDeviceInfo({
          isMobile: isMobileDevice,
          canNativeShare: nativeShareAvailable,
          userAgent: userAgent,
          isIOS: isIOS,
          isAndroid: isAndroid
        });
        
        console.log("Device detection:", {
          isMobile: isMobileDevice,
          canNativeShare: nativeShareAvailable,
          isIOS: isIOS,
          isAndroid: isAndroid
        });
      } catch (e) {
        console.error("Error checking device capabilities:", e);
        // Default to conservative values on error
        setDeviceInfo({
          isMobile: false,
          canNativeShare: false,
          userAgent: navigator.userAgent || '',
          isIOS: false,
          isAndroid: false
        });
      }
    };
    
    // Initial check
    checkDeviceCapabilities();
    
    // Re-check on window resize and orientation change
    window.addEventListener('resize', checkDeviceCapabilities);
    window.addEventListener('orientationchange', checkDeviceCapabilities);
    
    return () => {
      window.removeEventListener('resize', checkDeviceCapabilities);
      window.removeEventListener('orientationchange', checkDeviceCapabilities);
    };
  }, []);
  
  return deviceInfo;
};
