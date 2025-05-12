
import React, { useEffect } from 'react';

interface PagePerformanceTrackerProps {
  pageName: string;
}

const PagePerformanceTracker: React.FC<PagePerformanceTrackerProps> = ({ pageName }) => {
  useEffect(() => {
    try {
      // Record navigation timing metrics
      const timing = window.performance.timing;
      const loadTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      console.log(`[Performance] ${pageName} page load time:`, loadTime);
      
      // Record when the component was mounted
      const mountTime = new Date().toISOString();
      console.log(`[Performance] ${pageName} mounted at:`, mountTime);
      
      // You can send these metrics to your analytics or logging service
      // For example: logPerformance(pageName, loadTime, mountTime);
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
    
    // Cleanup function
    return () => {
      console.log(`[Performance] ${pageName} unmounted at:`, new Date().toISOString());
    };
  }, [pageName]);
  
  // This component doesn't render anything visible
  return null;
};

export default PagePerformanceTracker;
