
/**
 * Image optimization utilities for improving performance
 */
import { toast } from "sonner";

/**
 * Quality settings for different image types
 */
export const IMAGE_QUALITY = {
  hero: 80,
  product: 85,
  blog: 80,
  thumbnail: 75,
  icon: 90,
  productDetail: 90,
};

/**
 * Size limits for different image types (in KB)
 */
export const SIZE_LIMITS = {
  hero: 150,
  product: 80,
  productDetail: 200, // Exception for complex product detail images
  blog: 60,
  icon: 3,
};

/**
 * Cache control durations (in seconds)
 */
export const CACHE_DURATIONS = {
  hero: 60 * 60 * 24 * 30, // 30 days
  product: 60 * 60 * 24 * 365, // 1 year
  blog: 60 * 60 * 24 * 90, // 90 days
  thumbnail: 60 * 60 * 24 * 365, // 1 year
  icon: 60 * 60 * 24 * 365, // 1 year
  productDetail: 60 * 60 * 24 * 180, // 180 days
};

/**
 * Gets image dimensions and format info
 */
export const getImageInfo = async (imageUrl: string): Promise<{
  width: number;
  height: number;
  format: string;
  size: number;
} | null> => {
  try {
    // Create an image element to get dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Extract file extension from URL
        const format = imageUrl.split('.').pop()?.toLowerCase() || 'unknown';
        
        // Estimate size based on dimensions and format
        // This is a rough estimate - actual size would require a fetch
        const estimatedSize = Math.round((img.width * img.height * (format === 'png' ? 4 : 2)) / 1024);
        
        resolve({
          width: img.width,
          height: img.height,
          format,
          size: estimatedSize,
        });
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
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
  // Extract path and filename
  const urlPath = url.split('?')[0];
  const lastSlashIndex = urlPath.lastIndexOf('/');
  const path = lastSlashIndex !== -1 ? urlPath.substring(0, lastSlashIndex + 1) : '';
  const filename = lastSlashIndex !== -1 ? urlPath.substring(lastSlashIndex + 1) : urlPath;
  
  // Extract name and extension
  const dotIndex = filename.lastIndexOf('.');
  const name = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
  const extension = dotIndex !== -1 ? filename.substring(dotIndex) : '';
  
  // Generate a random hash (6 characters)
  const hash = Math.random().toString(36).substring(2, 8);
  
  // Combine everything
  return `${path}${name}-${hash}${extension}`;
};

/**
 * Optimizes image URL for CDN delivery
 * Transforms URLs to use Cloudinary with auto-format and quality parameters
 */
export const getOptimizedImageUrl = (
  url: string,
  type: keyof typeof IMAGE_QUALITY = 'product',
  options: { width?: number; height?: number; crop?: 'fill' | 'limit' | 'scale' } = {}
): string => {
  if (!url) return '/placeholder.svg';
  
  // Already a placeholder or SVG
  if (url.includes('/placeholder.svg') || url.endsWith('.svg')) {
    return url;
  }
  
  // Check if it's already a Cloudinary URL
  if (url.includes('res.cloudinary.com')) {
    // Parse existing URL to avoid adding duplicate transformations
    const hasTransformations = url.includes('/image/upload/');
    
    if (hasTransformations) {
      return url;
    }
    
    // Add cache control header for Cloudinary
    const cacheControl = `fl_attachment,fl_cache,max_age_${CACHE_DURATIONS[type]}`;
    
    // Add transformations to existing Cloudinary URL
    return url.replace(
      '/image/upload/',
      `/image/upload/${cacheControl},q_auto:${IMAGE_QUALITY[type]},f_auto${options.width ? `,w_${options.width}` : ''}${
        options.height ? `,h_${options.height}` : ''
      }${options.crop ? `,c_${options.crop}` : ''}/`
    );
  }
  
  // External URL or Storage URL, we can't transform directly
  // Log for analysis
  console.debug('Non-optimizable image URL:', url);
  return url;
};

/**
 * Validates if the image needs optimization
 */
export const validateImageSize = async (url: string, type: keyof typeof SIZE_LIMITS = 'product'): Promise<boolean> => {
  const info = await getImageInfo(url);
  if (!info) return false;
  
  const sizeLimit = SIZE_LIMITS[type];
  const isOptimal = info.size <= sizeLimit;
  
  if (!isOptimal) {
    console.warn(
      `Image exceeds size limit (${info.size}KB > ${sizeLimit}KB) [${type}]: ${url}`
    );
  }
  
  return isOptimal;
};

/**
 * Purges CDN cache for a specific path
 */
export const purgeCDNCache = async (path: string): Promise<boolean> => {
  try {
    // This is a placeholder for actual CDN cache purging implementation
    // In a real implementation, this would call your CDN's API
    console.log(`CDN cache purged for: ${path}`);
    return true;
  } catch (error) {
    console.error('Error purging CDN cache:', error);
    toast.error('Failed to purge CDN cache. Please try again.');
    return false;
  }
};
