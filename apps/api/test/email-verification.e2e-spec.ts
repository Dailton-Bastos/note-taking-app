import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import { InMemoryMailTransport, MailTransport } from '@nestjs/mail';
import type { INestApplication } from '@nestjs/common';
import { type SignUpDto } from '@repo/schemas';
import type { App } from 'supertest/types';
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { eq } from 'drizzle-orm';
import { fileURLToPath } from 'node:url';
import { AppModule } from './../src/app.module.js';
import { Database } from '../src/database/database.js';
import { users } from '../src/database/schema/index.js';
import { VerifyEmailMail } from '../src/auth/email-verification.mailer.js';

import 'dotenv/config';

describe('EmailVerificationController (e2e)', () => {
  let app: INestApplication<App>;
  let db: Database;
  const mailbox = new InMemoryMailTransport();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getDrizzleToken())
      .useValue(drizzle({ connection: process.env.POSTGRES_URL_TEST as string }))
      .overrideProvider(MailTransport)
      .useValue(mailbox)
      .compile();

    app = moduleFixture.createNestApplication();
    db = moduleFixture.get<Database>(getDrizzleToken());

    app.setGlobalPrefix('api');

    await migrate(db, {
      migrationsFolder: fileURLToPath(new URL('../drizzle', import.meta.url)),
    });
    await app.init();
  });

  describe('/api/auth/email/verify (POST)', () => {
    it('should verify the email with a valid token', async () => {
      const signUpDto: SignUpDto = {
        email: 'verify@example.com',
        password: 'password',
      };

      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const mail = mailbox.assertSent({ to: signUpDto.email, mail: VerifyEmailMail });
      const token = mail.link('/verify-email').searchParams.get('token');

      const response = await request(app.getHttpServer())
        .post('/api/auth/email/verify')
        .send({ token });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('verified', true);
    });

    it('should return 400 for an invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/email/verify')
        .send({ token: 'invalid' });
      expect(response.status).toBe(400);
    });
  });

  describe('/api/auth/email/verification (POST)', () => {
    it('should send verification email to current user', async () => {
      const signUpDto: SignUpDto = {
        email: 'verification@example.com',
        password: 'password',
      };

      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const signInResponse = await request(app.getHttpServer())
        .post('/api/auth/sign-in')
        .send(signUpDto);

      const cookie = signInResponse.headers['set-cookie'][0].split(';')[0];

      const response = await request(app.getHttpServer())
        .post('/api/auth/email/verification')
        .set('Cookie', cookie);
      expect(response.status).toBe(202);
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/email/verification');
      expect(response.status).toBe(401);
    });

    it('should return 409 if email is already verified', async () => {
      const signUpDto: SignUpDto = {
        email: 'already-verified@example.com',
        password: 'password',
      };

      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const signInResponse = await request(app.getHttpServer())
        .post('/api/auth/sign-in')
        .send(signUpDto);

      const cookie = signInResponse.headers['set-cookie'][0].split(';')[0];

      await request(app.getHttpServer())
        .post('/api/auth/email/verify')
        .send({
          token: mailbox
            .assertSent({ to: signUpDto.email, mail: VerifyEmailMail })
            .link('/verify-email')
            .searchParams.get('token'),
        });

      const response = await request(app.getHttpServer())
        .post('/api/auth/email/verification')
        .set('Cookie', cookie);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Email is already verified');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
