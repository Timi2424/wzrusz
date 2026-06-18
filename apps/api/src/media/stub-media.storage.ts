import { Injectable, Logger } from '@nestjs/common';
import {
  MediaStorage,
  MediaUploadInput,
  MediaUploadResult,
} from './media.types';

/** Placeholder served from web `public/brand/` — works in local catalog cards. */
export const STUB_MEDIA_URL = '/brand/logo-avatar.png';

@Injectable()
export class StubMediaStorage implements MediaStorage {
  private readonly logger = new Logger(StubMediaStorage.name);

  async upload(input: MediaUploadInput): Promise<MediaUploadResult> {
    this.logger.log(
      `[media-stub] key=${input.key} type=${input.contentType} bytes=${input.body.length}`,
    );
    return { url: STUB_MEDIA_URL };
  }
}
