import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import {
  localMediaFilePath,
  localMediaPublicUrl,
} from './local-media.paths';
import {
  MediaStorage,
  MediaUploadInput,
  MediaUploadResult,
} from './media.types';

@Injectable()
export class StubMediaStorage implements MediaStorage {
  private readonly logger = new Logger(StubMediaStorage.name);

  async upload(input: MediaUploadInput): Promise<MediaUploadResult> {
    const filePath = localMediaFilePath(input.key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, input.body);

    const url = localMediaPublicUrl(input.key);
    this.logger.log(
      `[media-stub] saved ${input.key} (${input.contentType}, ${input.body.length} bytes) → ${url}`,
    );
    return { url };
  }
}
