import { Module } from '@nestjs/common';
import { getMediaConfig } from './media.config';
import { MEDIA_STORAGE } from './media.types';
import { S3MediaStorage } from './s3-media.storage';
import { StubMediaStorage } from './stub-media.storage';

@Module({
  providers: [
    {
      provide: MEDIA_STORAGE,
      useFactory: () => {
        const config = getMediaConfig();
        return config.mode === 's3'
          ? new S3MediaStorage(config)
          : new StubMediaStorage();
      },
    },
  ],
  exports: [MEDIA_STORAGE],
})
export class MediaModule {}
