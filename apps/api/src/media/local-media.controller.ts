import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'node:fs';
import { getMediaConfig } from './media.config';
import { localMediaFilePath } from './local-media.paths';

const ALLOWED_FILENAME = /^[\w-]+\.(webp|jpe?g|png)$/i;

@Controller('media')
export class LocalMediaController {
  @Get('decorations/:filename')
  serveDecoration(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): void {
    if (getMediaConfig().mode !== 'stub') {
      throw new NotFoundException();
    }

    if (!ALLOWED_FILENAME.test(filename)) {
      throw new NotFoundException();
    }

    const filePath = localMediaFilePath(`decorations/${filename}`);
    if (!existsSync(filePath)) {
      throw new NotFoundException();
    }

    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const mimeByExt: Record<string, string> = {
      webp: 'image/webp',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    };
    res.type(mimeByExt[ext] ?? 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  }
}
