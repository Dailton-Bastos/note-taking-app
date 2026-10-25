import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { AppModule } from './../src/app.module.js';
import { Database } from '../src/database/database.js';
import { users } from '../src/database/schema/index.js';

import 'dotenv/config';

describe('SessionsController (e2e)', () => {
  let app: INestApplication<App>;
  let db: Database;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getDrizzleToken())
      .useValue(drizzle({ connection: process.env.POSTGRES_URL_TEST as string }))
      .compile();

    app = moduleFixture.createNestApplication();
    db = moduleFixture.get<Database>(getDrizzleToken());

    app.setGlobalPrefix('api');

    await app.init();
  });

  describe('/api/auth/sign-out (POST)', () => {
    it('should sign out successfully', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password123',
      };

      await db.delete(users).where(eq(users.email, user.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(user);

      const signInResponse = await request(app.getHttpServer())
        .post('/api/auth/sign-in')
        .send(user);

      const response = await request(app.getHttpServer())
        .post('/api/auth/sign-out')
        .set('Cookie', signInResponse.headers['set-cookie']);

      expect(response.status).toBe(204);
    });

    it('should throw an error if no session found', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/sign-out');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
