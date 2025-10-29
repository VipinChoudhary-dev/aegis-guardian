/**
 * Image Upload Utilities - NO FIREBASE STORAGE NEEDED!
 * Uses free alternatives: Base64 for small images, ImgBB for large files
 */

// Convert image file to Base64 (for profile photos - small files)
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Compress image before storing
export async function compressImage(file: File, maxWidth: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
}

// Upload to ImgBB (free, unlimited) - for E-FIR evidence photos
export async function uploadToImgBB(file: File): Promise<string> {
  try {
    const base64 = await imageToBase64(file);
    const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
    
    // ImgBB API (you can get free API key from https://api.imgbb.com/)
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'demo-key';
    
    const formData = new FormData();
    formData.append('image', base64Data);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    // Fallback: return base64 if upload fails
    return await imageToBase64(file);
  }
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { valid: true };
}

// Image upload service
export class ImageUploadService {
  /**
   * Upload profile photo (compressed Base64)
   */
  static async uploadProfilePhoto(file: File): Promise<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Compress and convert to base64 (stores in Firestore)
    return await compressImage(file, 400);
  }
  
  /**
   * Upload evidence photo (ImgBB or Base64 fallback)
   */
  static async uploadEvidencePhoto(file: File): Promise<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    try {
      // Try ImgBB first
      return await uploadToImgBB(file);
    } catch (error) {
      // Fallback to compressed base64
      return await compressImage(file, 1200);
    }
  }
  
  /**
   * Upload multiple evidence photos
   */
  static async uploadMultiplePhotos(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadEvidencePhoto(file));
    return await Promise.all(uploadPromises);
  }
}
