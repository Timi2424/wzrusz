import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MediaConfig } from './media.config';
import {
  MediaStorage,
  MediaUploadInput,
  MediaUploadResult,
} from './media.types';

@Injectable()
export class S3MediaStorage implements MediaStorage {
  private readonly logger = new Logger(S3MediaStorage.name);
  private readonly client: S3Client;

  constructor(private readonly config: MediaConfig) {
    if (!config.bucket) {
      throw new InternalServerErrorException('S3_MEDIA_BUCKET is not configured');
    }
    this.client = new S3Client({ region: config.region });
  }

  async upload(input: MediaUploadInput): Promise<MediaUploadResult> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: input.key,
          Body: input.body,
          ContentType: input.contentType,
        }),
      );
    } catch (error) {
      this.logger.error(
        `S3 upload failed for ${input.key}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }

    const url = `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${input.key}`;
    return { url };
  }
}
