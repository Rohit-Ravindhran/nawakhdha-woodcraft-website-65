
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  cacheBusting?: boolean;
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
  cacheBusting = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  // Set optimized image source
  useEffect(() => {
    if (!isInView && !priority) return;

    let optimizedUrl = getOptimizedImageUrl(src, imageType, { width, height });
    
    // Only add cache busting for non-SVG images when explicitly requested
    if (cacheBusting && optimizedUrl !== '/placeholder.svg' && !optimizedUrl.includes('.svg')) {
      const separator = optimizedUrl.includes('?') ? '&' : '?';
      optimizedUrl = `${optimizedUrl}${separator}v=${Math.floor(Date.now() / 60000)}`; // Cache for 1 minute
    }
    
    setImgSrc(optimizedUrl);
    setError(false);
  }, [src, imageType, width, height, isInView, priority, cacheBusting]);

  // Performance monitoring for critical images
  useEffect(() => {
    if (priority && imageType === 'hero' && typeof window !== 'undefined') {
      // Monitor Largest Contentful Paint for hero images
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const lcpEntry = entry as any;
          if (lcpEntry.element?.tagName === 'IMG' && lcpEntry.element.getAttribute('src')?.includes(src)) {
            console.debug('LCP Hero Image:', {
              src: lcpEntry.element.getAttribute('src'),
              time: entry.startTime,
              size: lcpEntry.size
            });
          }
        }
      });
      
      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // LCP not supported in this browser
      }
      
      return () => observer.disconnect();
    }
  }, [priority, imageType, src]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setError(true);
    onError?.();
    
    // Use fallback if available and different from current source
    if (fallbackSrc && fallbackSrc !== imgSrc) {
      setImgSrc(fallbackSrc);
      setError(false);
    }
  }, [onError, fallbackSrc, imgSrc]);

  // Don't render anything until in view (unless priority)
  if (!isInView && !priority) {
    return (
      <div ref={imgRef} className={cn('w-full h-full', className)}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <Skeleton className={cn(
          'absolute inset-0 z-10', 
          className
        )} />
      )}
      
      <img
        ref={imgRef}
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-opacity duration-300',
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
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'low' })}
        {...props}
      />
    </div>
  );
}
