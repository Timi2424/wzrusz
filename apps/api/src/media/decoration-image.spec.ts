import { BadRequestException } from '@nestjs/common';
import {
  assertDecorationImageFile,
  decorationImageExtension,
  decorationImageKey,
} from './decoration-image';

describe('decoration-image', () => {
  it('maps supported mime types to extensions', () => {
    expect(decorationImageExtension('image/jpeg')).toBe('jpg');
    expect(decorationImageExtension('image/png')).toBe('png');
    expect(decorationImageExtension('image/webp')).toBe('webp');
  });

  it('rejects unsupported mime types', () => {
    expect(() => decorationImageExtension('image/gif')).toThrow(
      BadRequestException,
    );
  });

  it('builds object key under prefix', () => {
    expect(
      decorationImageKey('decorations', 'abc-123', 'image/png'),
    ).toBe('decorations/abc-123.png');
  });

  it('validates file presence and size', () => {
    expect(() => assertDecorationImageFile(undefined)).toThrow(
      BadRequestException,
    );
    expect(() =>
      assertDecorationImageFile({
        mimetype: 'image/jpeg',
        size: 6 * 1024 * 1024,
        buffer: Buffer.from('x'),
      }),
    ).toThrow(BadRequestException);
  });
});
