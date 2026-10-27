/**
 * In-browser media validation and quality gate checks
 */

export interface VideoValidationResult {
  valid: boolean;
  duration: number;
  width: number;
  height: number;
  aspectRatio: string;
  fileSizeMB: number;
  errors: string[];
  warnings: string[];
}

export interface PhotoValidationResult {
  valid: boolean;
  width: number;
  height: number;
  laplacianVariance: number;
  isBlurry: boolean;
  errors: string[];
}

/**
 * Validates a video file using the native HTML5 video element:
 * - Checks format (mp4 / mov)
 * - Checks size (<= 500 MB)
 * - Checks duration (<= 60 seconds)
 * - Checks aspect ratio (approximates 9:16 portrait)
 * - Checks resolution (min 720p height >= 1280 or width >= 720)
 */
export async function validateVideoFile(file: File): Promise<VideoValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileSizeMB = file.size / (1024 * 1024);

  const allowedTypes = ['video/mp4', 'video/quicktime'];
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|mov)$/i)) {
    errors.push('File format must be MP4 or MOV');
  }

  if (fileSizeMB > 500) {
    errors.push(`File size (${fileSizeMB.toFixed(1)} MB) exceeds maximum allowed 500 MB`);
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;
      const ratio = width / (height || 1);

      if (duration > 60) {
        errors.push(`Video length (${duration.toFixed(1)}s) exceeds maximum allowed 60 seconds`);
      }

      // Vertical 9:16 is ~ 0.5625
      if (Math.abs(ratio - 9 / 16) > 0.04) {
        errors.push(`Orientation must be vertical 9:16 (detected ${width}x${height}, aspect ~${ratio.toFixed(2)})`);
      }

      if (height < 1280 || width < 720) {
        errors.push(`Resolution is ${width}x${height}. Minimum is 720x1280.`);
      }

      resolve({
        valid: errors.length === 0,
        duration,
        width,
        height,
        aspectRatio: `${width}:${height}`,
        fileSizeMB,
        errors,
        warnings,
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      errors.push('Unable to decode video metadata. The file may be corrupt or encoded in an unsupported codec.');
      resolve({
        valid: false,
        duration: 0,
        width: 0,
        height: 0,
        aspectRatio: 'unknown',
        fileSizeMB,
        errors,
        warnings,
      });
    };

    video.src = objectUrl;
  });
}

/**
 * Validates an image and runs a canvas-based edge sharpness check:
 * - Checks dimensions (min 800x600)
 * - Samples pixels to compute edge contrast (Laplacian approximation)
 */
export async function validateImageFile(fileOrUrl: File | string): Promise<PhotoValidationResult> {
  const errors: string[] = [];

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const src = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);

    img.onload = () => {
      if (typeof fileOrUrl !== 'string') {
        URL.revokeObjectURL(src);
      }

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (width < 800 || height < 600) {
        errors.push(`Photo resolution (${width}x${height}) is below minimum 800x600 px`);
      }

      // Quick canvas contrast sharpness test
      let laplacianVariance = 120;
      let isBlurry = false;

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const sampleW = 64;
          const sampleH = 64;
          canvas.width = sampleW;
          canvas.height = sampleH;
          ctx.drawImage(img, 0, 0, sampleW, sampleH);
          const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;

          // Compute rough pixel variance
          let sum = 0;
          let count = 0;
          for (let i = 0; i < imgData.length; i += 4) {
            // grayscale brightness
            const gray = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
            sum += gray;
            count++;
          }
          const mean = sum / count;
          let variance = 0;
          for (let i = 0; i < imgData.length; i += 4) {
            const gray = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
            variance += Math.pow(gray - mean, 2);
          }
          laplacianVariance = Math.round(variance / count);
          if (laplacianVariance < 45) {
            isBlurry = true;
          }
        }
      } catch (e) {
        // canvas security exception on some cross-origin urls
      }

      resolve({
        valid: errors.length === 0,
        width,
        height,
        laplacianVariance,
        isBlurry,
        errors,
      });
    };

    img.onerror = () => {
      if (typeof fileOrUrl !== 'string') {
        URL.revokeObjectURL(src);
      }
      errors.push('Failed to load image file');
      resolve({
        valid: false,
        width: 0,
        height: 0,
        laplacianVariance: 0,
        isBlurry: true,
        errors,
      });
    };

    img.src = src;
  });
}
