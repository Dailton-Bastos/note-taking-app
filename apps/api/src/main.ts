import { StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createSchema } from 'zod-openapi';
import type { SwaggerDocumentOptions } from './interfaces/swagger-document-options.interface.js';
import { AppModule } from './app.module.js';
import { EnvService } from './env/env.service.js';
import { EnvModule } from './env/env.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('The Note-Taking App API Documentation')
    .setDescription('API documentation for The Note-Taking App')
    .setVersion('1.0')
    .addCookieAuth('__Host-sid', {
      type: 'apiKey',
      in: 'cookie',
      description: 'Token stored in the __Host-sid cookie',
    })
    .build();

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
    standardSchemaConverter: (schema, { schemaType }) => {
      const converted = createSchema(schema as never, {
        io: schemaType,
        openapiVersion: '3.0.0',
      });
      return { schema: converted.schema, components: converted.components };
    },
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config, swaggerDocumentOptions);
  SwaggerModule.setup('api', app, documentFactory);

  const envService = app.select(EnvModule).get(EnvService, { strict: true });

  const PORT = envService.get('PORT');

  await app.listen(PORT);
}
await bootstrap();
