import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createSchema } from 'zod-openapi';
import type { INestApplication } from '@nestjs/common';
import type { SwaggerDocumentOptions } from '../src/interfaces/swagger-document-options.interface.js';
import type { App } from 'supertest/types';
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppModule } from './../src/app.module.js';

describe('Swagger (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('The Note-Taking App API Documentation')
      .setDescription('API documentation for The Note-Taking App')
      .setVersion('1.0')
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

    await app.init();
  });

  describe('/api (GET)', () => {
    it('should serve the Swagger UI', async () => {
      const response = await request(app.getHttpServer()).get('/api');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Swagger UI');
    });
  });

  describe('/api-json (GET)', () => {
    it('should serve the Swagger JSON document', async () => {
      const response = await request(app.getHttpServer()).get('/api-json');
      expect(response.status).toBe(200);
      expect(response.body.paths['/api/health']).toBeDefined();
      expect(response.body.paths['/api/auth/sign-up']).toMatchObject({
        post: {
          requestBody: expect.objectContaining({ content: expect.anything() }),
          responses: expect.objectContaining({
            '201': expect.anything(),
            '400': expect.anything(),
            '409': expect.anything(),
          }),
        },
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
