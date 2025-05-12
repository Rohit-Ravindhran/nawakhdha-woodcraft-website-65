
import React, { useEffect } from "react";

// Declare a global interface to add the ga property to the Window object
declare global {
  interface Window {
    ga?: (command: string, hitType: string, category: string, action: string, value?: number) => void;
  }
}

const PagePerformanceTracker: React.FC = () => {
  useEffect(() => {
    // Report page loading performance metrics
    if (typeof window !== 'undefined') {
      // Create PerformanceObserver for LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          console.log('LCP:', lastEntry.startTime / 1000, 'seconds');
          
          // Send to analytics if available
          if (window.ga) {
            window.ga('send', 'timing', 'Performance', 'LCP', lastEntry.startTime);
          }
        }
      });
      
      // Create PerformanceObserver for FID
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          // Use type assertion for the FirstInputDelay entry
          const fidEntry = firstEntry as any;
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime, 'ms');
          
          // Send to analytics if available
          if (window.ga) {
            window.ga('send', 'timing', 'Performance', 'FID', 
              fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });
      
      // Create PerformanceObserver for CLS
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
        
        // Send to analytics if available
        if (window.ga) {
          window.ga('send', 'event', 'Performance', 'CLS', clsValue);
        }
      });
      
      // Start observing
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Cleanup
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PagePerformanceTracker;
