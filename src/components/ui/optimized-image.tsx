
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  imageType?: 'hero' | 'product' | 'blog' | 'thumbnail' | 'icon' | 'productDetail';
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  imageType = 'product',
  width,
  height,
  className,
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.svg',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imgSrc, setImgSrc] = useState<string>(
    getOptimizedImageUrl(src, imageType, { width, height })
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    // Update optimized URL when src changes
    setImgSrc(getOptimizedImageUrl(src, imageType, { width, height }));
    setError(false);
    if (!priority) setIsLoading(true);
  }, [src, imageType, width, height, priority]);

  // Only measure LCP for hero images
  useEffect(() => {
    if (imageType === 'hero' && typeof window !== 'undefined') {
      // Report LCP to analytics when available
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Using type assertion to handle LargestContentfulPaint type
          const lcpEntry = entry as any;
          if (lcpEntry.element?.tagName === 'IMG') {
            console.debug('LCP image loaded:', {
              src: lcpEntry.element.getAttribute('src'),
              time: entry.startTime,
            });
            
            // Send to analytics if available
            if (typeof window !== 'undefined' && window.ga) {
              // Use type assertion for analytics
              const windowWithGa = window as any;
              if (typeof windowWithGa.ga === 'function') {
                windowWithGa.ga('send', 'timing', 'Images', 'LCP', entry.startTime);
              }
            }
          }
        }
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      
      return () => observer.disconnect();
    }
  }, [imageType]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    if (onError) onError();
    
    // Use fallback if available and different from current source
    if (fallbackSrc && fallbackSrc !== imgSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <Skeleton className={cn(
          'absolute inset-0 z-10', 
          className
        )} />
      )}
      
      <img
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-opacity',
          isLoading ? 'opacity-0' : 'opacity-100',
          {
            'object-cover': objectFit === 'cover',
            'object-contain': objectFit === 'contain',
            'object-fill': objectFit === 'fill',
            'object-none': objectFit === 'none',
            'object-scale-down': objectFit === 'scale-down',
          },
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        {...props}
      />
    </div>
  );
}
