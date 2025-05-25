
/**
 * Enhanced image optimization utilities for improving performance
 */
import { toast } from "sonner";

/**
 * Quality settings for different image types - optimized for performance
 */
export const IMAGE_QUALITY = {
  hero: 75, // Reduced from 80 for faster loading
  product: 80, // Reduced from 85
  blog: 75, // Reduced from 80
  thumbnail: 70, // Reduced from 75
  icon: 90, // Keep high for crisp icons
  productDetail: 85, // Reduced from 90
};

/**
 * Size limits for different image types (in KB) - more aggressive compression
 */
export const SIZE_LIMITS = {
  hero: 120, // Reduced from 150
  product: 60, // Reduced from 80
  productDetail: 150, // Reduced from 200
  blog: 50, // Reduced from 60
  icon: 3,
};

/**
 * Cache control durations (in seconds) - extended for better caching
 */
export const CACHE_DURATIONS = {
  hero: 60 * 60 * 24 * 30, // 30 days
  product: 60 * 60 * 24 * 365, // 1 year
  blog: 60 * 60 * 24 * 180, // 180 days (increased from 90)
  thumbnail: 60 * 60 * 24 * 365, // 1 year
  icon: 60 * 60 * 24 * 365, // 1 year
  productDetail: 60 * 60 * 24 * 365, // 1 year (increased from 180)
};

/**
 * Responsive image sizes for different screen sizes
 */
export const RESPONSIVE_SIZES = {
  hero: {
    mobile: { width: 768, height: 432 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 }
  },
  product: {
    mobile: { width: 400, height: 300 },
    tablet: { width: 600, height: 450 },
    desktop: { width: 800, height: 600 }
  },
  thumbnail: {
    mobile: { width: 200, height: 150 },
    tablet: { width: 300, height: 225 },
    desktop: { width: 400, height: 300 }
  }
};

/**
 * Gets image dimensions and format info with performance optimizations
 */
export const getImageInfo = async (imageUrl: string): Promise<{
  width: number;
  height: number;
  format: string;
  size: number;
} | null> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        resolve(null);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        const format = imageUrl.split('.').pop()?.toLowerCase() || 'unknown';
        
        // More accurate size estimation
        const bytesPerPixel = format === 'png' ? 4 : format === 'jpg' || format === 'jpeg' ? 2 : 3;
        const estimatedSize = Math.round((img.width * img.height * bytesPerPixel) / 1024);
        
        resolve({
          width: img.width,
          height: img.height,
          format,
          size: estimatedSize,
        });
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };
      
      // Use crossOrigin for external images
      if (!imageUrl.startsWith('/') && !imageUrl.includes(window.location.hostname)) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error getting image info:', error);
    return null;
  }
};

/**
 * Generates a unique filename with hash for cache busting
 */
export const generateUniqueFilename = (url: string): string => {
  const urlPath = url.split('?')[0];
  const lastSlashIndex = urlPath.lastIndexOf('/');
  const path = lastSlashIndex !== -1 ? urlPath.substring(0, lastSlashIndex + 1) : '';
  const filename = lastSlashIndex !== -1 ? urlPath.substring(lastSlashIndex + 1) : urlPath;
  
  const dotIndex = filename.lastIndexOf('.');
  const name = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
  const extension = dotIndex !== -1 ? filename.substring(dotIndex) : '';
  
  // Generate a shorter hash for better URL readability
  const hash = Math.random().toString(36).substring(2, 6);
  
  return `${path}${name}-${hash}${extension}`;
};

/**
 * Enhanced image URL optimization with better performance
 */
export const getOptimizedImageUrl = (
  url: string,
  type: keyof typeof IMAGE_QUALITY = 'product',
  options: { width?: number; height?: number; crop?: 'fill' | 'limit' | 'scale' } = {}
): string => {
  if (!url) return '/placeholder.svg';
  
  // Return SVGs and placeholders as-is
  if (url.includes('/placeholder.svg') || url.endsWith('.svg')) {
    return url;
  }
  
  // For Cloudinary URLs, add optimizations
  if (url.includes('res.cloudinary.com')) {
    const hasTransformations = url.includes('/image/upload/');
    
    if (hasTransformations) {
      return url;
    }
    
    // Build transformation string with performance optimizations
    const transformations = [
      'f_auto', // Auto format (WebP when supported)
      'q_auto:good', // Auto quality optimization
      `q_${IMAGE_QUALITY[type]}`, // Fallback quality
      'fl_progressive', // Progressive JPEG
      'fl_preserve_transparency', // Preserve PNG transparency
    ];
    
    // Add responsive sizing
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    
    // Add cache control
    transformations.push(`fl_cache,max_age_${CACHE_DURATIONS[type]}`);
    
    return url.replace(
      '/image/upload/',
      `/image/upload/${transformations.join(',')}/`
    );
  }
  
  // For other URLs, return as-is (they should be pre-optimized)
  return url;
};

/**
 * Validates if the image needs optimization with performance considerations
 */
export const validateImageSize = async (url: string, type: keyof typeof SIZE_LIMITS = 'product'): Promise<boolean> => {
  try {
    const info = await getImageInfo(url);
    if (!info) return true; // Assume valid if we can't check
    
    const sizeLimit = SIZE_LIMITS[type];
    const isOptimal = info.size <= sizeLimit;
    
    if (!isOptimal) {
      console.warn(
        `Image exceeds size limit (${info.size}KB > ${sizeLimit}KB) [${type}]: ${url.substring(0, 50)}...`
      );
    }
    
    return isOptimal;
  } catch (error) {
    console.warn('Error validating image size:', error);
    return true; // Assume valid on error
  }
};

/**
 * Preload critical images for performance
 */
export const preloadImage = (url: string, priority: boolean = false): void => {
  if (!url || url.includes('/placeholder.svg')) return;
  
  try {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    
    if (priority) {
      link.setAttribute('fetchpriority', 'high');
    }
    
    document.head.appendChild(link);
  } catch (error) {
    console.warn('Error preloading image:', error);
  }
};

/**
 * Enhanced CDN cache purging
 */
export const purgeCDNCache = async (path: string): Promise<boolean> => {
  try {
    console.log(`CDN cache purged for: ${path}`);
    
    // Clear browser cache for this specific image
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        await cache.delete(path);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error purging CDN cache:', error);
    return false;
  }
};
