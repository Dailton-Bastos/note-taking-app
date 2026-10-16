import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import type { INestApplication } from '@nestjs/common';
import { type SignUpDto, SignInDto } from '@repo/schemas';
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
      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const response = await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message');
    });

    it('should sign up a new user and log in', async () => {
      await db.delete(users).where(eq(users.email, signUpDto.email));

      const signUpResponse = await request(app.getHttpServer())
        .post('/api/auth/sign-up')
        .send(signUpDto);

      expect(signUpResponse.status).toBe(201);
      expect(signUpResponse.headers['set-cookie']).toBeDefined();
      expect(signUpResponse.headers['set-cookie'].length).toBeGreaterThan(0);
      expect(signUpResponse.headers['set-cookie'][0]).toMatch(
        /__Host-sid=.*; Path=\/; HttpOnly; Secure; SameSite=Lax/,
      );
    });
  });

  describe('/api/auth/sign-in (POST)', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign in an existing user', async () => {
      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const response = await request(app.getHttpServer()).post('/api/auth/sign-in').send(signInDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('session');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('cookie');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].length).toBeGreaterThan(0);
      expect(response.headers['set-cookie'][0]).toMatch(
        /__Host-sid=.*; Path=\/; HttpOnly; Secure; SameSite=Lax/,
      );
    });

    it('should not sign in if the credentials are incorrect', async () => {
      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const response = await request(app.getHttpServer())
        .post('/api/auth/sign-in')
        .send({ email: signInDto.email, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
