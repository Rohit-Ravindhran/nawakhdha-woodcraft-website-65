
import { useState, useCallback } from 'react';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

export function useImageLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<LightboxImage | null>(null);

  const openLightbox = useCallback((image: LightboxImage) => {
    setCurrentImage(image);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    // Delay clearing the image to allow for close animation
    setTimeout(() => setCurrentImage(null), 300);
  }, []);

  return {
    isOpen,
    currentImage,
    openLightbox,
    closeLightbox,
  };
}
