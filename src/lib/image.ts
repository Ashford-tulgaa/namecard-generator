// Image utility functions for profile photo processing

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Center-crops to a square and re-encodes as JPEG. Square output matches the
 * round avatar in the preview and the 1:1 photo that contact apps expect, so
 * faces no longer get lopped off by the CSS crop.
 */
export const compressImage = (file: File, size = 400, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('This browser cannot process images');

        const edge = Math.min(img.naturalWidth, img.naturalHeight);
        if (!edge) throw new Error('Image has no dimensions');

        const sourceX = (img.naturalWidth - edge) / 2;
        const sourceY = (img.naturalHeight - edge) / 2;

        // JPEG has no alpha channel — fill first so transparent PNGs don't go black.
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sourceX, sourceY, edge, edge, 0, 0, size, size);

        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process image'));
      } finally {
        cleanup();
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('That file could not be read as an image'));
    };

    img.src = objectUrl;
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please choose an image file.' };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { isValid: false, error: 'That image is over 5MB. Please choose a smaller one.' };
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Supported formats are JPEG, PNG, GIF and WebP.' };
  }

  return { isValid: true };
};
