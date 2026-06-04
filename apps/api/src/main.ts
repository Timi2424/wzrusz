/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { getAppEnv } from './env/app-env';
import { loadEnvFiles } from './env/load-env';

loadEnvFiles();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:4200';
  app.enableCors({ origin: corsOrigin });

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  Logger.log(`APP_ENV=${getAppEnv()}`);
  Logger.log(
    `Application is running on: http://${host}:${port}/${globalPrefix}`,
  );
}

bootstrap();
