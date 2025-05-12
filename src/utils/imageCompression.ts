
/**
 * Image compression utilities
 */

// Function to compress an image (using canvas)
export const compressImage = async (
  file: File, 
  maxWidthOrHeight: number = 1920,
  quality: number = 0.8,
  targetSize?: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    // Create file reader to read the file as data URL
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      // Create an image element
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Get original dimensions
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions to maintain aspect ratio
        if (width > height && width > maxWidthOrHeight) {
          height = Math.floor(height * (maxWidthOrHeight / width));
          width = maxWidthOrHeight;
        } else if (height > maxWidthOrHeight) {
          width = Math.floor(width * (maxWidthOrHeight / height));
          height = maxWidthOrHeight;
        }
        
        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determine optimal output format
        let outputFormat = 'image/webp';
        let outputQuality = quality;
        
        // Use JPEG for photos and PNG for graphics with transparency
        if (file.type === 'image/png' && hasTransparency(ctx, width, height)) {
          outputFormat = 'image/png';
        } else if (!navigator.userAgent.includes('Safari') || navigator.userAgent.includes('Chrome')) {
          // Use AVIF for browsers that support it (not Safari)
          outputFormat = 'image/avif';
          outputQuality = quality - 0.05; // AVIF can achieve same quality at lower settings
        }

        // For WebP, try to compress further if we have a target size
        if (targetSize && outputFormat === 'image/webp') {
          // Start with the provided quality and adjust if needed
          let currentQuality = outputQuality;
          let attempts = 0;
          const maxAttempts = 3;
          
          const tryCompress = (q: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(null);
                  return;
                }
                
                // If the blob size is still too large and we haven't reached max attempts,
                // try again with lower quality
                if (blob.size > targetSize * 1024 && attempts < maxAttempts) {
                  attempts++;
                  currentQuality = Math.max(0.6, currentQuality - 0.1); // Don't go below 0.6
                  tryCompress(currentQuality);
                } else {
                  resolve(blob);
                }
              },
              outputFormat,
              q
            );
          };
          
          // Start compression attempts
          tryCompress(currentQuality);
        } else {
          // Standard compression
          canvas.toBlob(
            (blob) => resolve(blob),
            outputFormat,
            outputQuality
          );
        }
      };
    };
  });
};

// Helper to detect transparency in an image
export function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const imageData = ctx.getImageData(0, 0, width, height).data;
  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] < 255) {
      return true;
    }
  }
  return false;
}
