import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import type { INestApplication } from '@nestjs/common';
import { type SignUpDto } from '@repo/schemas';
import type { App } from 'supertest/types';
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { AppModule } from './../src/app.module.js';
import { Database } from '../src/database/database.js';
import { users } from '../src/database/schema/index.js';

import 'dotenv/config';

describe('AuthController (e2e)', () => {
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

  describe('/api/auth/sign-up (POST)', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign up a new user', async () => {
      await db.delete(users).where(eq(users.email, signUpDto.email));

      const response = await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should not sign up a user with an existing email', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
