
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption?: string;
}

export function ImageLightbox({ isOpen, onClose, src, alt, caption }: ImageLightboxProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Handle ESC key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Reset image loaded state when src changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [src]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/80 backdrop-blur-sm",
        "transition-opacity duration-300 ease-out",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10",
          "p-2 rounded-full bg-black/50 text-white",
          "hover:bg-black/70 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image container */}
      <div
        className={cn(
          "relative max-w-[90vw] max-h-[90vh] flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "scale-100" : "scale-95"
        )}
      >
        {/* Image */}
        <div className="relative flex-1 flex items-center justify-center">
          <OptimizedImage
            src={src}
            alt={alt}
            className={cn(
              "max-w-full max-h-full object-contain",
              "transition-opacity duration-300",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            width={1920}
            height={1080}
            priority={true}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Loading spinner */}
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Caption */}
        {caption && (
          <div className="mt-4 px-4 py-2 bg-black/50 text-white text-center rounded">
            <p className="text-sm">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}
