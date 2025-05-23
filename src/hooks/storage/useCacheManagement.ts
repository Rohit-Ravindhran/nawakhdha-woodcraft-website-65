
/**
 * Hook for cache management operations
 */
export function useCacheManagement() {
  /**
   * Add a cache busting parameter to an existing URL
   */
  const addCacheBusting = (url: string): string => {
    if (!url || url.includes('/placeholder.svg') || url.endsWith('.svg')) {
      return url;
    }
    
    // Remove any existing query parameters
    const baseUrl = url.split('?')[0];
    
    // Add timestamp as query parameter
    return `${baseUrl}?v=${Date.now()}`;
  };

  /**
   * Purge CDN cache for an image URL
   */
  const purgeCDNCache = async (url: string): Promise<boolean> => {
    if (!url) return false;
    
    try {
      // Remove existing cache busting parameters
      const cleanUrl = url.split('?')[0];
      
      // Add new cache busting parameter
      const newUrl = `${cleanUrl}?v=${Date.now()}`;
      
      console.log(`Purging CDN cache for: ${url}`);
      console.log(`New cache-busted URL: ${newUrl}`);
      
      return true;
    } catch (error: any) {
      console.error('Error purging CDN cache:', error);
      return false;
    }
  };

  return {
    addCacheBusting,
    purgeCDNCache
  };
}
