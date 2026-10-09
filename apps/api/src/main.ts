import { StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { EnvService } from './env/env.service.js';
import { EnvModule } from './env/env.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');

  const envService = app.select(EnvModule).get(EnvService, { strict: true });

  const PORT = envService.get('PORT');

  await app.listen(PORT);
}
await bootstrap();
