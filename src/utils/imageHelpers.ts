
import { GalleryImage } from "@/components/admin/schemas/productSchema";

/**
 * Safely transforms gallery images from JSON to the expected format
 */
export function transformGalleryImages(galleryImages: any): GalleryImage[] {
  if (!galleryImages) return [];
  
  if (!Array.isArray(galleryImages)) {
    // If it's not an array but an object, try to convert it
    try {
      galleryImages = Object.values(galleryImages);
    } catch (e) {
      return [];
    }
  }
  
  return galleryImages
    .filter(img => img !== null && typeof img === 'object')
    .map(img => ({
      url: typeof img.url === 'string' ? img.url : '',
      caption: typeof img.caption === 'string' ? img.caption : '',
      alt: typeof img.alt === 'string' ? img.alt : undefined
    }))
    .filter(img => img.url !== '');
}
