import { BadRequestException } from '@nestjs/common';

export const DECORATION_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function decorationImageExtension(mimeType: string): string {
  const extension = EXTENSION_BY_MIME[mimeType];
  if (!extension) {
    throw new BadRequestException(
      'Image must be JPEG, PNG, or WebP',
    );
  }
  return extension;
}

export function assertDecorationImageFile(
  file: { mimetype: string; size: number; buffer: Buffer } | undefined,
): asserts file is { mimetype: string; size: number; buffer: Buffer } {
  if (!file || !file.buffer?.length) {
    throw new BadRequestException('Image file is required');
  }
  if (file.size > DECORATION_IMAGE_MAX_BYTES) {
    throw new BadRequestException('Image must be at most 5 MB');
  }
  decorationImageExtension(file.mimetype);
}

export function decorationImageKey(
  prefix: string,
  decorationId: string,
  mimeType: string,
): string {
  const extension = decorationImageExtension(mimeType);
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '');
  return `${normalizedPrefix}/${decorationId}.${extension}`;
}
