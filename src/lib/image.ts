// Image utility functions for profile photo processing

export const compressImage = (file: File, maxWidth = 400, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let newWidth = maxWidth;
      let newHeight = maxWidth;
      
      if (aspectRatio > 1) {
        // Landscape
        newHeight = maxWidth / aspectRatio;
      } else if (aspectRatio < 1) {
        // Portrait
        newWidth = maxWidth * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size should be less than 5MB' };
  }

  // Check if it's a supported format
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { isValid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
  }

  return { isValid: true };
};