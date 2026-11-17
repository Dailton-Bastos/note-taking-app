import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import { InMemoryMailTransport, MailTransport } from '@nestjs/mail';
import type { INestApplication } from '@nestjs/common';
import { type SignUpDto, SignInDto } from '@repo/schemas';
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

describe('MeController (e2e)', () => {
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

  describe('/api/me (GET)', () => {
    it('should return the current user', async () => {
      const signUpDto: SignUpDto = {
        email: 'me@example.com',
        password: 'password',
      };

      await db.delete(users).where(eq(users.email, signUpDto.email));

      await request(app.getHttpServer()).post('/api/auth/sign-up').send(signUpDto);

      const mail = mailbox.assertSent({ to: signUpDto.email, mail: VerifyEmailMail });
      const token = mail.link('/verify-email').searchParams.get('token');
      await request(app.getHttpServer()).post('/api/auth/email/verify').send({ token }).expect(200);

      const signInDto: SignInDto = {
        email: 'me@example.com',
        password: 'password',
      };

      const signInResponse = await request(app.getHttpServer())
        .post('/api/auth/sign-in')
        .send(signInDto);

      const cookie = signInResponse.headers['set-cookie'];

      const meResponse = await request(app.getHttpServer()).get('/api/me').set('Cookie', cookie);

      expect(meResponse.status).toBe(200);
      expect(meResponse.body).toHaveProperty('email', 'me@example.com');
      expect(meResponse.body).toHaveProperty('emailVerified', true);
    });

    it('should return 401 if not authenticated', async () => {
      const meResponse = await request(app.getHttpServer()).get('/api/me');

      expect(meResponse.status).toBe(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
