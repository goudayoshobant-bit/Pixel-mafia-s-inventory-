import { WallpaperAdjustments } from '../types/wallpaper';

/**
 * Downloads an image resized and center-cropped to the desired resolution using HTML5 Canvas.
 */
export async function downloadWithCustomResolution(
  imageUrl: string,
  targetWidth: number,
  targetHeight: number,
  filename: string,
  adjustments?: WallpaperAdjustments
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Apply filters if provided
        if (adjustments) {
          ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) sepia(${adjustments.sepia}%)`;
        }

        // Center-crop / cover scaling
        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > targetAspect) {
          // Image is wider than target: fit height, crop sides
          renderWidth = targetHeight * srcAspect;
          offsetX = (targetWidth - renderWidth) / 2;
        } else {
          // Image is taller than target: fit width, crop top/bottom
          renderHeight = targetWidth / srcAspect;
          offsetY = (targetHeight - renderHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        // Apply Vignette if adjustment > 0
        if (adjustments && adjustments.vignette > 0) {
          ctx.filter = 'none';
          const gradient = ctx.createRadialGradient(
            targetWidth / 2,
            targetHeight / 2,
            Math.min(targetWidth, targetHeight) * 0.35,
            targetWidth / 2,
            targetHeight / 2,
            Math.max(targetWidth, targetHeight) * 0.7
          );
          const alpha = (adjustments.vignette / 100) * 0.85;
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${alpha})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Blob conversion failed'));
            return;
          }
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          resolve();
        }, 'image/jpeg', 0.96);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      // Direct fallback download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      link.target = '_blank';
      link.click();
      resolve();
    };
  });
}
