
// Extend Window interface to include dataLayer for Google Tag Manager
interface Window {
  dataLayer?: any[];
}

// Make sure TypeScript knows about the global dataLayer variable
declare var dataLayer: any[];
