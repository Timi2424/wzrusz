export const MEDIA_STORAGE = Symbol('MEDIA_STORAGE');

export interface MediaUploadInput {
  key: string;
  body: Buffer;
  contentType: string;
}

export interface MediaUploadResult {
  url: string;
}

export interface MediaStorage {
  upload(input: MediaUploadInput): Promise<MediaUploadResult>;
}
