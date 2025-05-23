
import { useBucketOperations } from "./useBucketOperations";
import { useImageUpload } from "./useImageUpload";
import { useImageDelete } from "./useImageDelete";
import { useCacheManagement } from "./useCacheManagement";

/**
 * Main hook that combines all storage-related functionality
 */
export function useStorage() {
  const { checkBucketExists, isChecking } = useBucketOperations();
  const { uploadImage, uploading } = useImageUpload();
  const { deleteImage, deleting } = useImageDelete();
  const { addCacheBusting, purgeCDNCache } = useCacheManagement();

  return {
    // Bucket operations
    checkBucketExists,
    
    // Upload operations
    uploadImage,
    uploading,
    
    // Delete operations
    deleteImage,
    deleting,
    
    // Cache operations
    addCacheBusting,
    purgeCDNCache,
    
    // Consolidated status
    isLoading: uploading || deleting || isChecking
  };
}

// Export all hooks for direct usage if needed
export { useBucketOperations } from "./useBucketOperations";
export { useImageUpload } from "./useImageUpload";
export { useImageDelete } from "./useImageDelete";
export { useCacheManagement } from "./useCacheManagement";
export * from "./types";
