
/**
 * Types related to storage operations
 */

// Options for image upload
export interface ImageUploadOptions {
  optimize?: boolean;
  imageType?: string;
  maxWidth?: number;
  maxHeight?: number;
  cacheBusting?: boolean;
}

// Result of checking if a bucket exists
export interface BucketCheckResult {
  exists: boolean;
  error?: Error | null;
}
