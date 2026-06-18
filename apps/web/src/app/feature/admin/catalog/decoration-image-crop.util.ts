export const DECORATION_CROP_ASPECT = 4 / 3;
export const DECORATION_WEBP_QUALITY = 0.85;
export const DECORATION_EXPORT_MAX_WIDTH = 1200;

export interface CropTransform {
  baseScale: number;
  zoom: number;
  panX: number;
  panY: number;
}

export interface CropFrame {
  width: number;
  height: number;
}

export function computeBaseScale(
  imageWidth: number,
  imageHeight: number,
  frame: CropFrame,
): number {
  return Math.max(frame.width / imageWidth, frame.height / imageHeight);
}

export function computeCropRect(
  imageWidth: number,
  imageHeight: number,
  frame: CropFrame,
  transform: CropTransform,
): { x: number; y: number; width: number; height: number } {
  const scale = transform.baseScale * transform.zoom;
  const drawX = (frame.width - imageWidth * scale) / 2 + transform.panX;
  const drawY = (frame.height - imageHeight * scale) / 2 + transform.panY;

  let x = (0 - drawX) / scale;
  let y = (0 - drawY) / scale;
  let width = frame.width / scale;
  let height = frame.height / scale;

  x = Math.max(0, Math.min(x, imageWidth - 1));
  y = Math.max(0, Math.min(y, imageHeight - 1));
  width = Math.min(width, imageWidth - x);
  height = Math.min(height, imageHeight - y);

  return { x, y, width, height };
}

export async function cropImageToWebpFile(
  source: CanvasImageSource & { width: number; height: number },
  crop: { x: number; y: number; width: number; height: number },
  originalName: string,
): Promise<File> {
  const targetWidth = Math.min(
    Math.round(crop.width),
    DECORATION_EXPORT_MAX_WIDTH,
  );
  const targetHeight = Math.round((targetWidth * crop.height) / crop.width);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not available');
  }

  ctx.drawImage(
    source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => {
        if (!value) {
          reject(new Error('WebP export failed'));
          return;
        }
        resolve(value);
      },
      'image/webp',
      DECORATION_WEBP_QUALITY,
    );
  });

  const baseName = originalName.replace(/\.[^.]+$/, '') || 'dekoracja';
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
}
